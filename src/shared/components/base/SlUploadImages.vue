<template>
  <div class="uploadImage">
    <!-- {{fileList}} -->
    <el-upload
      action="#"
      ref="uploader"
      list-type="picture-card"
      :limit="200"
      :auto-upload="true"
      accept="image/png, image/jpeg, image/jpg, image/bmp, image/gif, image/ico"
      :file-list="fileList"
      :http-request="uploadFile"
      :on-error="onError"
      :on-success="onSuccess"
      :on-exceed="handleExceed"
      :on-change="onChange"
      :before-upload="beforeUpload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file, fileList)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SlUploadImages',
  props: {
    fileLists: { type: Array, required: false, default: () => { return [] } }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imageUrl: '',
      fileList: []
    }
  },
  watch: {
    'fileLists': {
      handler (newValue) {
        this.fileList = newValue
      },
      deep: true
    }
  },
  methods: {
    beforeUpload (file) {
      const TYPE = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/ico']
      const LIMITSIZE = file.size / 1024 / 1024 <= 4
      const LIMITIMAGE = TYPE.includes(file.type)
      if (!LIMITIMAGE || !LIMITSIZE) {
        !LIMITIMAGE && this.$message.error('上传图片格式不正确!')
        !LIMITSIZE && this.$message.error('上传图片大小不能超过 4MB!')
        this.$refs.uploader.abort(file)
        this.fileList.splice(this.fileList.indexOf(file), 1) // 删除钩子列表中数据
      }
    },
    handleExceed () {
      this.$message.error(`上传图片不能超过200张!`)
    },
    onChange (file, fileList) {
      if (this.fileList.some(item => item.name === file.name)) {
        this.$refs.uploader.abort(file) // 有相同的图片取消上传
        fileList.splice(fileList.indexOf(file), 1) // 删除钩子列表中数据
        this.$message.error('不能上传相同的图片!')
      } else {
        this.fileList.push(file)
      }
    },
    handleRemove (file) {
      this.$confirm('确实要删除该图片吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileList.splice(this.fileList.indexOf(file), 1) // 删除钩子列表中数据
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) { },
    onSuccess (response, file, fileList) {
      // debugger
      // this.uploadedImages.push(file.name)
      // console('eeerdd', response, file, fileList)
    },
    uploadFile () {
      console.log('Upload')
    },
    onError () { this.$message.error('上传图片失败!') }
  }

}
</script>
<style scoped lang="scss">
.uploadImage {
  /deep/.el-upload-list--picture-card .el-upload-list__item {
    width: 110px;
    height: 110px;
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
