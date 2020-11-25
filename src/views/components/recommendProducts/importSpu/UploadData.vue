<template>
  <!-- 导入SPU -- 上传数据 -->
  <div class="upload-data" v-loading="isUploadData">
    <!-- 页头内容 -->
    <span class="upload-data__header">
      <el-button type="primary" icon="el-icon-download" @click="downloadTemplate">下载模板</el-button>
    </span>
    <!-- 页面主体内容 提交时增加loading效果-->
    <div class="upload-data__body">
      <el-upload
        class="sl-upload"
        action="/upload/file"
        :http-request="uploadFile"
        :show-file-list="false"
      >
        <span class="sl-upload__action">{{ fileName || '请选择导入文件' }}</span>
      </el-upload>
    </div>
    <!-- 操作按钮 -->
    <div class="upload-data__actions">
      <el-button @click="cancel" :disabled="!file">{{$t('button.cancelText')}}</el-button>
      <el-button type="primary" @click="submit" :disabled="!file">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { downloadFile } from '@/shared/util'
import RECOMMEND_API from '@api/recommendProducts/recommendProducts.js'
const { mapActions } = createNamespacedHelpers('productManage')
const { uploadSpuData, spuDataTemplate } = RECOMMEND_API
export default {
  // 当前组件的名字
  name: 'spuUploadData',
  data () {
    return {
      // 文件名称
      fileName: '',
      // 上传的文件
      file: null,
      // 是否正在上传文件
      isUploadData: false
    }
  },
  methods: {
    ...mapActions(['setImportSpuResultData']),
    // 下载Spu文件模板
    downloadTemplate () {
      spuDataTemplate().then((response) => {
        if (response.success) {
          downloadFile(response.data, 'import-spu-template.xlsx')
        }
      })
    },
    // 上传文件的回调
    uploadFile (event) {
      // 获取回调的文件
      const file = event.file
      // 将上传的数据暂存在本地
      this.file = file
      this.fileName = file.name
    },
    // 清空已经上传的文件
    cancel () {
      this.fileName = ''
      this.file = null
    },
    // 提交上传的文件，进入下一步
    submit () {
      const file = this.file
      // 判断是否已经上传了文件且有回调
      if (file) {
        // 生成一个FormData, 并将文件赋予其作为一个属性
        let formData = new FormData()
        formData.append('file', file)
        // 将当前上传数据的状态设置为true
        this.isUploadData = true
        // 执行上传文件
        uploadSpuData(formData).then((response) => {
          // 如果接口返回成功状态
          if (response.success) {
            const data = response.data
            // 将后台回调的数据暂存在 [store]
            this.setImportSpuResultData(data).then(() => {
              // 进入到下一步
              this.$emit('submit')
            })
          }
          // 将当前上传数据状态设置为false
          this.isUploadData = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-data {
  // 页面头部
  &__header {
    display: block;
    padding: 2rem 0 1rem;
  }

  // 页面主体内容
  &__body {
    width: 100%;
    padding: 20rem 0;
    border: 1px dashed #d9d9d9;
    border-radius: 0.5rem;

    &:hover {
      border-color: #409eff;
    }

    .sl-upload {
      height: 4rem;
      /deep/.el-upload {
        position: relative;
        width: 100%;
        height: 4rem;
      }
      &__action {
        display: block;
        width: 70%;
        border: 1px solid #c0c4cc;
        border-radius: 0.5rem;
        text-align: left;
        font-size: 1.8rem;
        color: #606266 !important;
        padding: 1rem 2rem;

        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        &:hover {
          border-color: #409eff;
        }
      }
    }
  }

  // 页面操作
  &__actions {
    padding: 2rem 0;
    display: flex;
    justify-content: center;
    > * {
      margin: 0 2rem;
      padding: 0.9rem 3rem;
    }
  }
}
</style>
