<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="tableData"
    border
    height="200"
    :summary-method="getSummaries"
    show-summary
    style="width: 100%;"
  >
    <el-table-column prop="deliveryNo" label="发货单号" width="200"></el-table-column>
    <el-table-column prop="settlementOrderNo" label="结算单号" width="200"></el-table-column>
    <el-table-column prop="settlementAmount" label="结算金额 (￥)">
      <template slot-scope="scope">{{ scope.row.settlementAmount | numFormat('thousandsSeparate') }}</template>
    </el-table-column>
    <el-table-column prop="supplierAmount" label="供货金额 (￥)">
      <template slot-scope="scope">{{ scope.row.supplierAmount | numFormat('thousandsSeparate') }}</template>
    </el-table-column>
    <el-table-column prop="supplierTotal" label="供货数量"></el-table-column>
    <el-table-column prop="freightSubsidy" label="运费补贴 (￥)">
      <template slot-scope="scope">{{ scope.row.freightSubsidy | numFormat('thousandsSeparate') }}</template>
    </el-table-column>
    <el-table-column prop="createdAt" label="账期时间" width="200"></el-table-column>
  </el-table>
</template>

<script>
import { thousandsSeparate } from '@shared/util'
import GoodsApi from '@api/goods'

export default {
  name: 'DeliverySettleInfo',
  props: {
    deliveryNo: {
      type: String,
      default: ''
    },
    settlementOrderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const sumProperties = ['settlementAmount', 'supplierAmount', 'supplierTotal', 'freightSubsidy']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        if (sumProperties.indexOf(column.property) !== -1) {
          let total = 0
          data.forEach(item => {
            let value = Number(item[column.property])
            if (!isNaN(value)) {
              total += value
            }
          })
          sums[index] = thousandsSeparate(total, 2)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    getData () {
      if (!this.deliveryNo && !this.settlementOrderId) {
        return
      }
      this.loading = true
      GoodsApi.getDeliveryInfo({
        deliveryNo: this.deliveryNo,
        settlementOrderId: this.settlementOrderId
      }).then(res => {
        if (res.success) {
          this.tableData = res.data || []
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
