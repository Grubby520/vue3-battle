<template>
  <!-- 导入SPU -- 上传结果 -->
  <div class="upload-result">
    <!-- 上传结果 -->
    <span class="upload-result__title">{{ title }}</span>
    <!-- 上传详细信息 -->
    <span class="upload-result__message">{{ message }}</span>
    <!-- 结果页面操作 存在失败数据时展示-->
    <div class="upload-result__actions" v-if="failCount > 0">
      <el-button @click="download">下载导入失败数据</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { downloadJsonToCsv } from '@/shared/json2Csv'
// 获取[store] [productManage] 模块的 [mapGetters]
const { mapGetters } = createNamespacedHelpers('productManage')

export default {
  name: 'spuUploadResult',
  data () {
    return {
      // 失败上传的数据条数
      failCount: 0,
      // 成功上传的数据条数
      successCount: 0,
      // 总共上传的数据条数
      allCount: 0,
      // 页面标题
      title: '',
      // 页面结果具体信息
      message: '',
      // 失败的数据集合
      failedList: []
    }
  },
  computed: {
    ...mapGetters(['importSpuResultData'])
  },
  created () {
  },
  mounted () {
    const importSpuResultData = this.importSpuResultData || {}
    const failCount = importSpuResultData.failCount || 0
    const successCount = importSpuResultData.successCount || 0
    const allCount = failCount + successCount

    this.failedList = importSpuResultData.failList
    this.failCount = failCount
    this.successCount = successCount
    this.allCount = allCount

    // 生成要渲染的内容
    this.title = failCount > 0 ? '导入失败' : '导入成功'
    this.message = failCount > 0
      ? '导入失败（共{total}条数据，成功导入{success}条，导入失败{failed}条）'
        .replace('{total}', allCount)
        .replace('{success}', successCount)
        .replace('{failed}', failCount)
      : '（共{total}条数据，成功导入{success}条）'
        .replace('{total}', allCount)
        .replace('{success}', successCount)
  },
  methods: {
    // 下载导入失败数据
    download () {
      const data = this.failedList
      // 下载成[CSV]类型文件数据
      downloadJsonToCsv(data, '导入SPU失败数据.csv', {
        supplierSpu: '供方货号',
        categoryName: '品类',
        weight: '预估重量',
        supplyPrice: '供货价',
        reason: '失败原因'
      })
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
