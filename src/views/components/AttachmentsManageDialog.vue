<template>
  <el-dialog
    :title="title"
    custom-class="attachments-manage-dialog"
    :visible.sync="dialogVisible"
    :width="width"
    :show-close="showClose"
    :close-on-press-escape="false"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
    @close="dialogCloseHandler"
    @closed="dialogClosedHandler"
  >
    <el-upload
      ref="elUpload"
      action="#"
      :multiple="multiple"
      :limit="limitNumber"
      :http-request="uploadFile"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :file-list="data"
    >
      <el-button v-if="canEdit" size="small" type="primary">点击上传</el-button>
      <div
        v-if="canEdit"
        slot="tip"
        class="el-upload__tip"
      >上传附件支持的文件的格式: jpg、jpeg、png、rar、pdf、zip。最多上传{{limitNumber}}个。每个文件最大50M。</div>

      <div slot="file" slot-scope="{file}">
        <div class="file-container clearfix">
          <el-tooltip placement="top" effect="light">
            <div slot="content" style="max-width:300px">{{file.name}}</div>
            <p class="display-inline-block text-overflow" style="max-width:300px">{{file.name}}</p>
          </el-tooltip>
          <div class="float-right">
            <el-link type="primary" @click="download(file)" :disabled="file.status !== 'success'">下载</el-link>&nbsp;
            <el-link v-if="canEdit" type="primary" @click="handleRemove(file)">删除</el-link>
          </div>
        </div>
        <div style="position:relative;">
          <VirtualProgress :status="file.status"></VirtualProgress>
        </div>
      </div>
    </el-upload>
    <!-- 无数据 -->
    <el-alert
      class="mt-1rem"
      v-if="!$refs.elUpload || data.length === 0 && $refs.elUpload.uploadFiles.length === 0"
      title="暂无附件"
      type="info"
      center
      :closable="false"
    ></el-alert>
    <span v-if="canEdit" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :disabled="!canSubmit">{{$t('button.saveText')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { asyncSome, exportFileFromRemote } from '@/shared/util'
import VirtualProgress from '@/views/components/VirtualProgress.vue'

export default {
  name: 'AttachmentsManageDialog',
  components: {
    VirtualProgress
  },
  props: {
    title: {
      type: String,
      default: '上传附件'
    },
    width: {
      type: String,
      default: '40%'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'edit'// edit:编辑,view:查看
    },
    data: {
      type: Array,
      default: () => []
    },
    // 附件与业务关联的标识字段
    dataKey: {
      type: String,
      default: 'id'
    },
    // oss相关接口需要
    folder: {
      type: String,
      required: false,
      default: ''
    },
    limitNumber: {
      type: Number,
      required: false,
      default: 30
    },
    // oss相关接口需要,0为商品图片 1为尺寸图片 2供应商资质图片 3报账单 4付款申请 5扣款单 6付款单
    fileType: {
      type: Number,
      required: false,
      default: undefined
    },
    // 同时上传多张图
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    // 上传文件限制
    limits: {
      type: Array,
      default: () => [
        {
          type: 'size',
          message: '',
          meta: {
            size: 50
          }
        },
        {
          type: 'fileType',
          message: `文件格式不正确,仅支持jpg、jpeg、png、rar、pdf、zip`,
          meta: {
            fileSuffixs: ['.jpg', '.jpeg', '.png', '.rar', '.pdf', '.zip'],
            accept: [
              'application/pdf',
              'image/png',
              'image/jpeg',
              'application/zip',
              'application/x-zip-compressed'
            ]
          }
        },
        {
          type: 'repeat',
          message: `文件重复,请重新上传`
        }
      ]
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    show: {
      handler: function (val, oldVal) {
        if (oldVal !== val) {
          this.dialogVisible = val
        }
      },
      immediate: true
    },
    dialogVisible (val) {
      this.$emit('update:show', val)
    }
  },
  computed: {
    canEdit () {
      return this.status === 'edit'
    },
    canSubmit () {
      return this.data.length === 0 || (this.data.length > 0 && this.$refs.elUpload.uploadFiles.every(item => item.status === 'success'))
    }
  },
  methods: {
    ...mapActions('oss', [
      'GET_UPLOAD_API', // 预上传oss地址
      'UPLOAD_FILE', // 上传oss
      'DELETE_FILES' // 删除oss文件
    ]),
    dialogCloseHandler () {
      const uploadFiles = this.$refs.elUpload.uploadFiles || []
      uploadFiles.forEach((file) => {
        if (file.status !== 'success') {
          this.deleteCancelFile(file)
        }
      })
    },
    dialogClosedHandler () {
      this.emitChange([])
    },
    submit () {
      this.$emit('submitHandler')
    },
    handleExceed () {
      this.$message.error(`上传文件不能超过${this.limitNumber}个!`)
    },
    handleRemove (file) {
      this.$confirm('确实要删除该附件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        const files = this.data.filter(item => item.name !== file.name)
        // 如果存在与业务关联的主键
        if (typeof file[this.dataKey] !== 'undefined') {
          this.emitChange(files)
          return
        }

        // 上传中的处理
        if (file.status !== 'success') {
          let elUploadFiles = this.$refs.elUpload.uploadFiles || []
          this.deleteCancelFile(elUploadFiles.find(item => item.name === file.name))
          this.emitChange(files)
          return
        }

        // 如果不存在与业务关联的主键则直接删除oss上的文件
        this.DELETE_FILES({ url: file.src })
          .then(res => {
            this.emitChange(files)
            this.$message.success('删除成功')
          })
      })
    },
    deleteCancelFile (uploadFailFile) {
      if (uploadFailFile) {
        uploadFailFile.raw.abort()
        this.deleteUploadFile(uploadFailFile)
      }
    },
    deleteUploadFile (file) {
      this.$refs.elUpload.handleRemove(file)
    },
    download (file) {
      exportFileFromRemote({
        url: file.src,
        name: file.name,
        params: {},
        beforeLoad: () => {
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '下载中' })
        },
        afterLoad: () => {
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    },

    emitChange (arr) {
      this.$emit('update:data', arr)
      this.$emit('change', arr)
    },
    uploadFile (file) {
      this.preOssUrl(file).then(res => {
        this.uploadToOss(res, file.file)
      })
    },
    preOssUrl (file) {
      // 获取预上传oss地址
      const contentType = file.file.type ? file.file.type : 'application/octet-stream'
      const params = { 'folder': this.folder, 'fileName': file.file.name, 'contentType': contentType, 'fileType': this.fileType }
      return this.GET_UPLOAD_API(params)
        .then(res => {
          return res.data
        })
    },
    uploadToOss (data, file) {
      // 根据预上传oss地址上传图片到oss上 , Content-Type：如image/png 图片格式
      const newFile = {
        src: data.showUrl,
        name: file.name,
        uid: file.uid
      }
      this.UPLOAD_FILE({
        preUploadUrl: data.preUploadUrl,
        file
      })
        .then(res => {
          this.emitChange(this.$refs.elUpload.uploadFiles.map(item => {
            if (item.name === newFile.name) {
              return newFile
            }
            return item
          }))
        }).catch(() => {
        })
    },

    beforeUpload (file) {
      return this.limitsHandler(file)
    },
    limitsHandler (file) {
      let someFilter = async (item) => {
        let isError = false
        let message = item.message
        switch (item.type) {
          case 'fileType':
            let fileSuffix = file.name.substr(file.name.lastIndexOf('.'))
            if (file.type) {
              isError = !item.meta.accept.includes(file.type)
            } else {
              isError = !item.meta.fileSuffixs.includes(fileSuffix)
            }
            break
          case 'repeat':
            isError = await this.limitRepeat(file)
            break
          case 'size':
            message = `文件大小不能超过${item.meta.size}M`
            isError = !this.limitSize(item, file)
            break
        }
        if (isError) {
          setTimeout(() => {
            this.$message.error(message)
          }, 0)
          // 不符合条件中断上传
          return new Promise((resolve, reject) => { reject(new Error()) })
        }
        return isError
      }
      return asyncSome(this.limits, someFilter)
    },
    async limitRepeat (file) {
      try {
        return this.data.some(item => item.name === file.name)
      } catch (error) {
        return error
      }
    },
    limitSize (limitItem, file) {
      return file.size / 1024 / 1024 <= limitItem.meta.size
    }
  }
}
</script>

<style lang="scss">
.attachments-manage-dialog .el-dialog__body {
  padding: 1rem 2rem 2rem 2rem;
}

div:focus,
ul:focus,
li:focus {
  outline: none !important;
}
</style>

<style lang="scss" scoped>
.file-container {
  padding: 0 1em;
  background-color: #ecf0f5;
}

/deep/ {
  .el-upload-list {
    max-height: 25em;
    overflow: auto;
  }

  .el-upload-list__item .el-progress {
    position: unset;
    top: 0;
  }
  .el-upload-list__item .el-progress-bar {
    margin-right: -55px;
    padding-right: 50px;
  }

  .el-upload-list__item .el-progress__text {
    position: unset;
    right: auto;
    top: auto;
  }
  .el-upload-list__item:hover {
    background: unset;
    & .el-progress__text {
      display: unset;
    }
  }
}
</style>
