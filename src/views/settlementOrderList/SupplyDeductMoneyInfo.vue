<template>
  <el-table
    :data="tableData"
    border
    height="200"
    :summary-method="getSummaries"
    show-summary
    style="width: 100%;"
  >
    <el-table-column prop="supplementaryDeductionNo" label="补扣款单号" width="200"></el-table-column>
    <el-table-column prop="paymentType" label="款项类型" width="200"></el-table-column>
    <el-table-column prop="sourceOrderType" label="源单类型"></el-table-column>
    <el-table-column prop="sourceOrderNo" label="源单编号"></el-table-column>
    <el-table-column prop="supplementaryDeductionAmount" label="总金额 (￥)">
      <template
        slot-scope="scope"
      >{{ scope.row.supplementaryDeductionAmount | numFormat('thousandsSeparate') }}</template>
    </el-table-column>
    <el-table-column prop="remarks" label="备注"></el-table-column>
    <el-table-column prop="confirmAt" label="确认时间" width="200"></el-table-column>
  </el-table>
</template>

<script>
import { thousandsSeparate } from '@shared/util'

export default {
  name: 'SupplyDeductMoneyInfo',
  props: {
  },
  data () {
    return {
      tableData: [{
        supplementaryDeductionNo: '12987122',
        paymentType: '扣款',
        sourceOrderType: '发货单',
        sourceOrderNo: '12987122',
        supplementaryDeductionAmount: 10,
        remarks: '这是备注',
        confirmAt: '2010-02-03 11:25:23'
      }, {
        supplementaryDeductionNo: '12987122',
        paymentType: '补款',
        sourceOrderType: '发货单',
        sourceOrderNo: '12987122',
        supplementaryDeductionAmount: 10123213,
        remarks: '这是备注',
        confirmAt: '2010-02-03 11:25:23'
      }, {
        supplementaryDeductionNo: '12987122',
        paymentType: '扣款',
        sourceOrderType: '发货单',
        sourceOrderNo: '12987122',
        supplementaryDeductionAmount: 10,
        remarks: '这是备注',
        confirmAt: '2010-02-03 11:25:23'
      }]
    }
  },
  components: {

  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const sumProperties = ['supplementaryDeductionAmount']
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
