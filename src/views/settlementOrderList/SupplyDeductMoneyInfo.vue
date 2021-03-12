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
    <el-table-column prop="supplementaryDeductionNo" label="补扣款单号" width="200"></el-table-column>
    <el-table-column prop="paymentTypeName" label="款项类型" width="200"></el-table-column>
    <el-table-column prop="sourceOrderTypeName" label="源单类型"></el-table-column>
    <el-table-column prop="sourceOrderNo" label="源单编号"></el-table-column>
    <el-table-column prop="amount" label="总金额 (￥)">
      <template slot-scope="scope">{{ scope.row.amount | numFormat('thousandsSeparate') }}</template>
    </el-table-column>
    <el-table-column prop="remarks" label="备注"></el-table-column>
    <el-table-column prop="confirmAt" label="确认时间" width="200"></el-table-column>
  </el-table>
</template>

<script>
import { thousandsSeparate } from '@shared/util'
import GoodsApi from '@api/goods'

export default {
  name: 'SupplyDeductMoneyInfo',
  props: {
    deliveryNo: {
      type: [String, Number],
      default: ''
    },
    settlementOrderId: {
      type: [String, Number],
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
      const sumProperties = ['amount']
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
      GoodsApi.getSupplementaryDeductionInfo({
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
