<template>
  <div class="merchant-notice">
    <el-alert title="商家发货须知" type="warning" :closable="false">
      <ol>
        <li>1、每个发货单务必打一个包裹，对应一个物流单号，包裹内必须添加纸质发货清单，切勿将不同发货单商品混合打包发货。</li>
        <li>2、商家填错发货单号、快递单号，商家发货颜色、尺码、款式、细节与需求不符，按照退件处理，回寄费用商家负担，请商家严把商品质量。</li>
        <li>3、每个发货单SKU款数不超过50款，SKU件数不超过200件。</li>
        <li>4、快递面单上须备注发货单ID</li>
        <li>5、包装方式： 同款/色/码，10件一捆装。 若无同色/码，可同款1捆装</li>
      </ol>
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'MerchantNotice'
}
</script>

<style lang="scss" scoped>
.merchant-notice {
  line-height: 1.5;
  margin-bottom: 1.6rem;
  & /deep/ {
    .el-alert__title,
    .el-alert__description {
      color: #606266;
      font-size: 1.4rem;
    }
  }
}
</style>
