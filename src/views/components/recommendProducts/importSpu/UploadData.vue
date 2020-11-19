<template>
  <!-- 导入SPU -- 上传数据 -->
  <div class="upload-data">
    <!-- 页头内容 -->
    <span class="upload-data__header">
      <div class="sl-button" @click="downloadTemplate">
        <i class="el-icon-download"></i>
        <span class="sl-button__download">下载模板</span>
      </div>
    </span>
    <!-- 页面主体内容 提交时增加loading效果-->
    <div class="upload-data__body" v-loading="isUploadData">
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
      <el-button @click="cancel" :disabled="!resultData">取消</el-button>
      <el-button type="primary" @click="submit" :disabled="!resultData">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { downloadFile } from '@/shared/download'
import importSpuTemplate from '@/assets/template/import-spu.xlsx'
const { mapActions } = createNamespacedHelpers('productManage')
export default {
  // 当前组件的名字
  name: 'spuUploadData',
  data () {
    return {
      // 文件名称
      fileName: '',
      // 上传数据后后台回调的数据
      resultData: null,
      // 是否正在上传文件
      isUploadData: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions(['setImportSpuResultData']),
    // 下载Spu文件模板
    downloadTemplate () {
      downloadFile(importSpuTemplate, 'import-spu-template.xlsx')
    },
    // 上传文件的回调
    uploadFile (event) {
      // 获取回调的文件
      const file = event.file
      // 生成一个FormData, 并将文件赋予其作为一个属性
      let formData = new FormData()
      formData.append('file', file)
      // 将当前上传数据的状态设置为true
      this.isUploadData = true
      // 执行上传文件
      this.$http.post('http://10.250.1.205:9300/product/importSpu', formData)
        .then((response) => {
          // 如果接口返回成功状态
          if (response.success) {
            const data = response.data
            // 将后台返回的数据暂存在本地
            this.resultData = data
            this.fileName = file.name
          }
          // 将当前上传数据状态设置为false
          this.isUploadData = false
        })
    },
    // 清空已经上传的文件
    cancel () {
      this.fileName = ''
      this.resultData = null
    },
    // 提交上传的文件，进入下一步
    submit () {
      // 判断是否已经上传了文件且有回调
      if (this.resultData) {
        // 将后台回调的数据暂存在 [store]
        this.setImportSpuResultData(this.resultData).then(() => {
          // 进入到下一步
          this.$emit('submit')
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
    .sl-button {
      font-size: 2.2rem;

      .sl-button__download {
        cursor: pointer;
        color: #8080ff;
      }
    }
  }

  // 页面主体内容
  &__body {
    width: 100%;
    padding: 20rem 0;
    border: 1px dashed #797979;
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
        border: 1px solid #000000;
        text-align: left;
        font-size: 1.8rem;
        color: #999999 !important;
        padding: 1rem 2rem;

        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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
