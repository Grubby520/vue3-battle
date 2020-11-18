<template>
  <!-- 导入SPU -- 上传数据 -->
  <div class="upload-data">
    <!-- 页头内容 -->
    <span class="upload-data__header">
      <div class="sl-button">
        <i class="el-icon-download"></i>
        <span class="sl-button__download">下载模板</span>
      </div>
    </span>
    <!-- 页面主体内容 -->
    <div class="upload-data__body">
      <el-upload
        class="sl-upload"
        action="/api/v1.0/data/upload/file"
        :on-change="handleChange"
        :show-file-list="false"
      >
        <span class="sl-upload__action">{{ fileName || '请选择导入文件' }}</span>
      </el-upload>
    </div>
    <!-- 操作按钮 -->
    <div class="upload-data__actions">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'spuUploadData',
  data () {
    return {
      active_step: 1,
      fileName: ''
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 上传文件的回调
    handleChange (file) {
      this.fileName = file.name
    },
    // 重置已经上传的文件
    cancel () {
      this.fileName = ''
    },
    // 提交上传的文件，进入下一步
    submit () {
      this.$emit('submit')
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
