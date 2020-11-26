<template>
  <div>
    <el-upload
      action
      :file-list="fileList"
      :show-file-list="true"
      :http-request="httpRequest"
      :on-change="onChange"
      :on-error="onError"
      :on-success="onSuccess"
      :on-progress="onProgress"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :on-remove="onRemove"
      class="upload-zip"
      drag
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将zip文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="progress-item" slot="file" slot-scope="{file}">
        <div class="progress-container">
          <p>{{file.name}}</p>
          <el-progress :percentage="file.percentage" />
        </div>
        <div class="progress-explain">
          <p v-if="file.status === 'uploading'">上传中</p>
          <p v-if="file.status === 'uploading'">已上传{{file.percentage}}%</p>
          <p v-if="file.status === 'success'">成功：{{file.raw.successCount}}</p>
          <p v-if="file.status === 'success'">失败：{{file.raw.failCount}}</p>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import ImportProductApi from '@api/importProduct'

export default {
  name: 'UploadZip',
  props: {
    accept: {
      type: String,
      default:
        '.zip'
    },
    limit: {
      type: Number,
      default: 20
    },
    size: {
      type: Number,
      default: 200
    }
  },
  data: function () {
    return {
      requestUrl: '',
      fileList: [],
      uploadingCount: 0
    }
  },
  watch: {
    uploadingCount (val) {
      this.$emit('statusChange', val === 0 ? 'done' : 'uploading')
    }
  },
  methods: {
    preUploadAction (params, elParams) {
      return new Promise((resolve, reject) => {
        ImportProductApi.preUploadAction(params).then(res => {
          let { success, data } = res
          if (success && data.baseCheckVO && data.baseCheckVO.code === 0) {
            elParams.onProgress({ percent: 20 }, elParams.file)
            resolve(data.imageImportVO)
          } else {
            this.uploadingCount--
            elParams.onError(data && data.baseCheckVO && data.baseCheckVO.message ? (elParams.file.name + data.baseCheckVO.message) : `${elParams.file.name}上传失败`)
            reject(new Error('预检请求失败'))
          }
        }).catch(err => {
          this.uploadingCount--
          elParams.onError(`${elParams.file.name}上传失败`)
          reject(err)
        })
      })
    },
    httpRequest (elParams) {
      elParams.file.status = 'uploading'
      elParams.file.percentage = 0
      elParams.onProgress({ percent: 0 }, elParams.file)
      const file = elParams.file
      this.preUploadAction({ fileName: file.name, contentType: file.type }, elParams).then(res => {
        let config = {
          timeout: 8 * 60 * 1000,
          headers: {
            'Content-Type': file.type
          },
          onUploadProgress: function (ev) {
            ev.percent = 20
            if (ev.total > 0) {
              ev.percent = Math.floor(ev.loaded / ev.total * 100 * 0.6) + 20
            }
            elParams.onProgress({ percent: ev.percent }, elParams.file)
          }
        }
        ImportProductApi.ossUploadAction(res.url, file, config).then((response) => {
          elParams.onProgress({ percent: 80 }, elParams.file)
          this.afterUploadAction({ productId: res.productId, fileName: file.name }, elParams)
        }).catch((error) => {
          this.uploadingCount--
          let timeout = String(error).indexOf('timeout') > -1
          if (timeout) {
            elParams.onError('上传文件超时，请检查网络或调整文件大小')
          } else {
            elParams.onError(error)
          }
        })
      })
    },
    afterUploadAction (params, elParams) {
      ImportProductApi.afterUploadAction(params).then(res => {
        if (res.success) {
          elParams.file.successCount = res.data.successCount
          elParams.file.failCount = res.data.failCount
          elParams.onProgress({ percent: 100 }, elParams.file)
          elParams.onSuccess()
        } else {
          elParams.onError(elParams.file.name + res.message || `${elParams.file.name}上传失败`)
        }
      }).catch(err => {
        elParams.onError(err)
      }).finally(res => {
        this.uploadingCount--
      })
    },
    beforeUpload (file) {
      const isOverSize = file.size / 1024 / 1024 > this.size
      if (this.uploadingCount >= this.limit) {
        this.$message({
          type: 'error',
          message: '同时上传的压缩包不能超过20个，请在其它压缩包上传完成后再操作',
          duration: 15000
        })
        return false
      }
      // 上传文件类型限制
      if (this.accept.indexOf(this.getFileType(file.name)) === -1) {
        this.$message({
          type: 'error',
          message: `${file.name}文件类型错误，请选择以${this.accept}为结尾的文件`,
          duration: 15000
        })
        return false
      }
      // 上传文件大小限制
      if (isOverSize) {
        this.$message.error(
          `${file.name}超出限制大小，大小不能超过 ${this.size}MB`
        )
        return false
      }
      this.uploadingCount++
    },
    onChange (file, fileList) {
    },
    // eslint-disable-next-line handle-callback-err
    onError (error, file, fileList) {
      this.$message({
        type: 'error',
        message: typeof error === 'string' ? error : `${file.name}上传失败！`,
        duration: 15000
      })
    },
    onProgress (event, file, fileList) {
    },
    onSuccess (response, file, fileList) {
    },
    beforeRemove (file) {
      const isOverSize = file.size / 1024 / 1024 > this.size
      if (this.uploadingCount >= this.limit) {
        return true
      }
      if (isOverSize) {
        return true
      }
      if (this.accept.indexOf(this.getFileType(file.name)) === -1) {
        return true
      }
      return this.$confirm(
        `你确定要删除 ${file.name || file.fileName}？`,
        '提示',
        {
          lockScroll: false,
          closeOnClickModal: false
        }
      )
    },
    onRemove (file, fileList) {
      // if (file.status === 'uploading') {
      //   this.verifyIsUploadComplete()
      // }
      // this.updateFiles(fileList)
    },
    updateFiles (fileList, index) {

    },
    handleUploadProgress (percentage) {

    },
    getFileType (fileName) {
      return fileName
        .substring(fileName.lastIndexOf('.') + 1)
        .toLowerCase()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .upload-zip {
  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }
  .el-upload-list__item {
    display: inline-block;
    width: 50%;
    &:hover {
      background: none;
      .el-progress__text {
        display: inline-block;
      }
    }
    &:first-child {
      margin-top: 2rem;
    }
  }
  .el-upload-list__item .el-progress {
    position: static;
  }
  .el-upload-list__item .el-progress__text {
    position: static;
  }
  .el-upload-list__item .el-progress-bar {
    margin-right: -5.5rem;
    padding-right: 5rem;
  }
}
.progress-item {
  display: flex;
  width: 100%;
  .progress-container {
    flex: 1;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 2rem 1.4rem;
    margin-right: 1.4rem;
    margin-bottom: 1.4rem;
  }
  .progress-explain {
    width: 12rem;
    flex: 0 1 auto;
    padding-top: 2rem;
  }
}
</style>
