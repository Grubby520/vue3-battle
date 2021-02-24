<template>
  <el-table
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
    <el-table-column prop="paymentAt" label="账期时间" width="200"></el-table-column>
  </el-table>
</template>

<script>
import { thousandsSeparate } from '@shared/util'

export default {
  name: 'DeliverySettleInfo',
  props: {
  },
  data () {
    return {
      tableData: [{
        deliveryNo: '12987122',
        settlementOrderNo: '王小虎',
        settlementAmount: '1000.99989',
        supplierAmount: '3123213123.215',
        supplierTotal: 10,
        freightSubsidy: 103,
        paymentAt: '2010-02-03 11:25:23'
      }, {
        deliveryNo: '1298712200',
        settlementOrderNo: '王小虎',
        settlementAmount: '234',
        supplierAmount: '3.2',
        supplierTotal: 10,
        freightSubsidy: 103,
        paymentAt: '2010-02-03 11:25:23'
      }, {
        deliveryNo: '129871220011',
        settlementOrderNo: '王小虎',
        settlementAmount: '234',
        supplierAmount: '3.2',
        supplierTotal: 10,
        freightSubsidy: 103,
        paymentAt: '2010-02-03 11:25:23'
      }]
    }
  },
  components: {

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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
