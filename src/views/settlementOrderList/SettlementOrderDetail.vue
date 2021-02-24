<template>
  <div>
    <p class="border-bottom mb-2rem">
      <el-button type="text" size="medium" @click="goBack">返回</el-button>
      <el-divider direction="vertical"></el-divider>
      <span v-if="settlementOrderId">
        结算单号：
        <b class="color-text--gray-mid">{{settlementOrderId}}</b>
      </span>
      <span v-if="deliveryId">
        发货单号：
        <b class="color-text--gray-mid">{{deliveryId}}</b>
      </span>
    </p>

    <SlPanel title="发货单结算信息">
      <DeliverySettleInfo></DeliverySettleInfo>
    </SlPanel>
    <SlPanel title="供货明细">
      <SupplyInfo></SupplyInfo>
    </SlPanel>
    <SlPanel title="补扣款单信息">
      <SupplyDeductMoneyInfo></SupplyDeductMoneyInfo>
    </SlPanel>
  </div>
</template>

<script>
import DeliverySettleInfo from './DeliverySettleInfo'
import SupplyInfo from './SupplyInfo'
import SupplyDeductMoneyInfo from './SupplyDeductMoneyInfo'

export default {
  name: 'SettlementOrderDetail',
  components: {
    DeliverySettleInfo,
    SupplyInfo,
    SupplyDeductMoneyInfo
  },
  data () {
    return {
      deliveryId: this.$route.query.deliveryId,
      settlementOrderId: this.$route.query.settlementOrderId
    }
  },
  mounted () {
  },
  methods: {
    goBack () {
      this.$router.push({
        path: localStorage.getItem('activePath')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid #ddd;
}
</style>
