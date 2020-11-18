<template>
  <!-- 导入SPU -- 上传结果 -->
  <div class="upload-result">
    <!-- 上传结果 -->
    <span class="upload-result__title">{{ '导入失败' || '导入成功' }}</span>
    <!-- 上传详细信息 -->
    <span class="upload-result__message">{{ '导入失败（共4条数据，成功导入1条，导入失败3条）' || '（共4条数据，成功导入4条）'}}</span>
    <!-- 结果页面操作 -->
    <div class="upload-result__actions">
      <el-button @click="download">下载导入失败数据</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'spuUploadResult',
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 下载导入失败数据
    download () {

    }
  }
}
</script>

<style scoped lang="scss">
.upload-result {
  text-align: center;
  > span {
    display: block;
    padding: 1em;
  }

  &__title {
    font-size: 2rem;
    margin-top: 4rem;
  }

  &__message {
    font-size: 1.6rem;
  }

  &__actions {
    padding: 2rem 0;
    display: flex;
    justify-content: center;
  }
}
</style>
