<template>
  <div>
    <p class="border-bottom mb-2rem">
      <el-button type="text" size="medium" @click="goBack">返回</el-button>
      <el-divider direction="vertical"></el-divider>
      <span v-if="settlementOrderNo">
        结算单号：
        <b class="color-text--gray-mid">{{settlementOrderNo}}</b>
      </span>
      <span v-if="deliveryNo">
        发货单号：
        <b class="color-text--gray-mid">{{deliveryNo}}</b>
      </span>
    </p>

    <SlPanel title="发货单结算信息">
      <DeliverySettleInfo :deliveryNo="deliveryNo" :settlementOrderNo="settlementOrderNo"></DeliverySettleInfo>
    </SlPanel>
    <SlPanel title="供货明细">
      <SupplyInfo :deliveryNo="deliveryNo" :settlementOrderNo="settlementOrderNo"></SupplyInfo>
    </SlPanel>
    <SlPanel title="补扣款单信息">
      <SupplyDeductMoneyInfo :deliveryNo="deliveryNo" :settlementOrderNo="settlementOrderNo"></SupplyDeductMoneyInfo>
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
      deliveryNo: this.$route.query.deliveryNo,
      settlementOrderNo: this.$route.query.settlementOrderNo
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
