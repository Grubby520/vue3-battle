<template>
  <div>
    <el-upload action="1111" @on-change="onChange" class="upload-zip" drag multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadZip',
  data: function () {
    return {
      requestUrl: ''
    }
  },
  methods: {
    onChange (e) {
      console.log('onChange e', e)
    },
    customUpload (e) {
      console.log('upload e', e)
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
