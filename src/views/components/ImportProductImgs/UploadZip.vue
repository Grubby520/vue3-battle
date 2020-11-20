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
      <div slot="file" slot-scope="{file}">
        <span>{{file.name}}</span>
        <el-progress :percentage="file.percentage" />
      </div>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UploadZip',
  props: {
    accept: {
      type: String,
      default:
        '.jpg,.jpeg,.png,.pdf,.xlsx,.xls,.docx,.doc,.zip,.rar,.arj,.z,.zip'
    },
    limit: {
      type: Number,
      default: 20
    },
    size: {
      type: Number,
      default: 5
    }
  },
  data: function () {
    return {
      requestUrl: '',
      fileList: []
    }
  },
  methods: {
    preUploadAction (params) {
      const preUrl = '/productImage/generateImageZipImportUrl'
      return new Promise((resolve, reject) => {
        this.$get(preUrl, params).then(res => {
          let { success, data } = res
          if (success && data.baseCheckVO && data.baseCheckVO.code === 0) {
            resolve(data.imageImportVO)
          } else {
            reject(new Error('预检请求失败'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    httpRequest (elParams) {
      console.log(elParams)
      const file = elParams.file
      this.preUploadAction({ fileName: file.name, contentType: file.type }).then(res => {
        axios.put(res.url, file, {
          timeout: 8 * 60 * 1000,
          headers: {
            'Content-Type': file.type
          }
        })
          .then((response) => {
            this.afterUploadAction({ productId: res.productId, fileName: file.name }, elParams)
          })
          .catch((error) => {
            elParams.onError()
            let timeout = String(error).indexOf('timeout') > -1
            if (timeout) {
              this.$message({
                message: '上传图片超时，请检查网络或调整图片大小',
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
      }).catch(err => {
        console.log(err)
      })
    },
    afterUploadAction (params, elParams) {
      elParams.onSuccess()
      axios.post('/api/productImage/importImageZip', params).then(res => {
        if (res.success) {
          console.log(`${params.fileName}入库成功`)
        }
      })
    },
    beforeUpload (file) {
      console.log('beforeUpload')
      const isOverSize = file.size / 1024 / 1024 > this.size
      // 上传文件大小限制
      if (isOverSize) {
        this.$message.error(
          `${file.name}超出限制大小，大小不能超过 ${this.size}MB`
        )
        return false
      }
      // 上传文件类型限制
      if (this.accept.indexOf(this.getFileType(file.name)) === -1) {
        this.$message({
          showClose: true,
          message: `${file.name}文件类型错误，请选择以${this.accept}为结尾的文件`,
          type: 'error',
          duration: 15000
        })
        return false
      }
      this.uploadCount += 1
      this.$emit('changeDisabled', true)
    },
    onChange (e) {
      console.log('onChange e', e)
    },
    onError () {
      console.log('onError')
      this.verifyIsUploadComplete()
      this.$message.error('上传失败！')

      // this.onUploadProgress(0)
    },
    onSuccess (response, file, fileList) {
      console.log('onSuccess', response, file, fileList)
      this.verifyIsUploadComplete()
      this.$message.success('上传成功！')
      // this.files.push({
      //   fileName: file.name,
      //   url: this.httpResponse.showUrl
      // })
      // this.fileList = fileList
      // this.$emit('emitFile', this.files)

      // this.onUploadProgress(0)
    },
    beforeRemove (file) {
      console.log('beforeRemove')
      const isOverSize = file.size / 1024 / 1024 > this.size
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
    removeFile (file, index) {
      console.log('removeFile')
      this.$confirm(
        `你确定要删除 ${file.name || file.fileName}？`,
        '提示',
        {
          lockScroll: false,
          closeOnClickModal: false
        }
      ).then(
        () => {
          if (!this.showFileList) {
            this.files.splice(index, 1)
            this.fileList.splice(index, 1)
          }
          this.$emit('emitFile', this.fileList, this.files)
        },
        () => { }
      )
    },
    onRemove (file, fileList) {
      if (file.status === 'uploading') {
        this.verifyIsUploadComplete()
      }
      this.updateFiles(fileList)
    },
    updateFiles (fileList, index) {
      this.files = fileList.map((item) => {
        return {
          fileName: item.name,
          url: item.url
        }
      })
      this.$emit('emitFile', this.files)
    },
    onExceed (files, fileList) {
      this.$message.warning(
        `最多上传 ${this.limit} 个文件，请把已上传的文件删除后重新上传！`
      )
    },
    onProgress (event, file, fileList) {

    },
    verifyIsUploadComplete () {
      this.vaildCount += 1
      if (this.vaildCount === this.uploadCount) {
        this.$emit('changeDisabled', false)
        this.uploadCount = 0
        this.vaildCount = 0
      }
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
}
</style>
