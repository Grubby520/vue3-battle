<template>
  <div class="upload-image" :class="{'hide-upload':hideUpload}">
    <!-- 上传图片 -->
    <el-upload
      action="null"
      ref="uploader"
      list-type="picture-card"
      :disabled="disabled"
      :multiple="multiple"
      :limit="imgNumber"
      :accept="accept.join()"
      :file-list="fileList"
      :http-request="uploadFile"
      :on-exceed="handleExceed"
      :on-change="onChange"
    >
      <i slot="default" class="el-icon-plus"></i>
      <!-- 图片图标 -- 展示图片 -->
      <div slot="file" slot-scope="{file}">
        <div class="loading-module" v-loading="file.loading"></div>
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          @load="imgLoad(file)"
          @error="imgError($event,file)"
        />
        <span v-if="tools.length > 0" class="el-upload-list__item-actions">
          <span
            v-if="tools.includes('zoom')"
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled && tools.includes('download')" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled && tools.includes('delete')"
            class="el-upload-list__item-delete"
            @click="handleRemove(file, fileList)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { downloadFile, asyncSome } from '@/shared/util'

export default {
  name: 'UploadImages',
  model: {
    event: 'imagesChange',
    prop: 'images'
  },
  props: {
    // [{name:'',url:'',...}]
    images: {
      type: Array,
      default: () => []
    },
    // 0：商品图片 1：尺寸图片 2：资质信息
    imageType: {
      type: Number,
      required: false,
      default: undefined
    },
    // 文件夹标识,便于oss分目录存储
    folder: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    accept: {
      type: Array,
      required: false,
      default: () => ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp']
    },
    imgNumber: {
      type: Number,
      required: false,
      default: 200
    },
    tools: {
      type: Array,
      default: () => ['zoom', 'download', 'delete']
    },
    limits: {
      type: Array,
      default: () => [
        {
          type: 'size',
          message: '',
          meta: {
            size: 4
          }
        },
        {
          type: 'scale',
          message: '',
          meta: {
            tip: '图片高宽比例仅支持1:1或4:3',
            scales: [1, 4 / 3]
          }
        },
        {
          type: 'ppi',
          message: `图片高宽均不能超过4096像素`,
          meta: {
            width: 4096,
            height: 4096
          }
        }
      ]
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    }
  },
  computed: {
    hideUpload () {
      return this.imgNumber > 0 && this.imgNumber === this.fileList.length
    }
  },
  watch: {
  },
  mounted () {
    this.fileList = JSON.parse(JSON.stringify(this.images))
  },
  methods: {
    ...mapActions('oss', [
      'GET_UPLOAD_API',
      'UPLOAD_FILE'
    ]),
    imgLoad (file) {
      this.$set(file, 'loading', false)
    },
    imgError (evt, file) {
      if (file.url) {
        this.$set(file, 'loading', true)
      }
      setTimeout(() => {
        if (evt.target && file.url) {
          evt.target.src = file.url
        }
      }, 500)
    },
    handleExceed () {
      this.$message.error(`上传图片不能超过${this.imgNumber}张!`)
    },
    onChange (file, fileList) {
      this.fileList.push(file)
    },
    uploadFile (req) {
      this.beforeUpload(req.file).then(hasError => {
        if (!hasError) {
          this.callUpload(req.file)
        }
      })
    },
    getUploadUrl (file) {
      let params = { fileName: file.name, contentType: file.type, fileType: this.imageType, folder: this.folder }
      // 获取预上传oss地址
      return this.GET_UPLOAD_API(params)
        .then(res => {
          if (res) {
            return res
          }
        })
    },
    callUpload (file) {
      this.getUploadUrl(file).then(res => {
        if (res) {
          let { data = {} } = res
          this.UPLOAD_FILE({
            ...data,
            file
          })
            .then(res => {
              let tempFile = this.fileList.find(item => item.name === file.name)
              tempFile.url = data.showUrl
              this.emitImageChange()
            })
        }
      })
    },
    beforeUpload (file) {
      return this.limitsHandler(file)
    },
    limitsHandler (file) {
      let defaultLimits = [
        {
          type: 'repeat',
          message: `图片重复,请重新上传`
        },
        {
          type: 'fileType',
          message: `图片格式不正确,仅支持${this.accept.join()}`,
          meta: {
            accept: this.accept
          }
        }
      ]
      let allLimits = defaultLimits.concat(this.limits)
      let someFilter = async (item) => {
        let isError = false
        let message = item.message
        switch (item.type) {
          case 'fileType':
            isError = !item.meta.accept.includes(file.type)
            break
          case 'repeat':
            isError = this.limitRepeat(file)
            break
          case 'size':
            message = `图片大小不能超过${item.meta.size}M`
            isError = !this.limitSize(item, file)
            break
          case 'scale':
            message = item.meta.tip
            isError = !await this.limitScale(item, file)
            break
          case 'ppi':
            isError = !await this.limitPPI(item, file)
            break
        }
        if (isError) {
          this.$message.error(message)
          this.deleteFile(file)
        }
        return isError
      }
      return asyncSome(allLimits, someFilter)
    },
    limitRepeat (file) {
      return this.fileList.filter(item => item.name === file.name).length > 1
    },
    limitSize (limitItem, file) {
      return file.size / 1024 / 1024 <= limitItem.meta.size
    },
    limitScale (limitItem, file) {
      return new Promise((resolve, reject) => {
        try {
          let fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = (event) => {
            let image = new Image()
            image.src = event.target.result
            image.onload = function () {
              // 高宽比
              let scale = image.height / image.width
              resolve(limitItem.meta.scales.includes(scale))
            }
          }
        } catch (error) {
          resolve(false)
        }
      })
    },
    limitPPI (limitItem, file) {
      return new Promise((resolve, reject) => {
        try {
          let fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = (event) => {
            let image = new Image()
            image.src = event.target.result
            image.onload = function () {
              resolve(image.height < limitItem.meta.height && image.width < limitItem.meta.width)
            }
          }
        } catch (error) {
          resolve(false)
        }
      })
    },
    handleRemove (file) {
      this.$confirm('确实要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFile(file)
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      downloadFile(file.url, file.name)
    },
    deleteFile (file) {
      let index = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(index, 1)
      this.emitImageChange()
    },
    emitImageChange () {
      let imgs = []
      this.fileList.forEach(image => {
        imgs.push({
          name: image.name,
          url: image.url
        })
      })
      this.$emit('imagesChange', imgs)
      // 用于表单验证change事件捕获
      if (this.$parent) {
        this.$parent.$emit('el.form.change')
      }
    }
  }

}
</script>
<style scoped lang="scss">
.loading-module {
  position: absolute;
  height: 100%;
  width: 100%;
}

.hide-upload /deep/ {
  .el-upload {
    display: none;
  }
}

.upload-image {
  /deep/.el-upload-list--picture-card .el-upload-list__item {
    width: 110px;
    height: 110px;
    & > div {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      line-height: 1;
    }
  }
  /deep/.el-upload--picture-card {
    width: 110px;
    height: 110px;
  }
  /deep/.el-upload--picture-card {
    line-height: 110px;
  }
}
</style>
