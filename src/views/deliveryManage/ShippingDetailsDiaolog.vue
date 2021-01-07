<template>
  <el-dialog :visible.sync="dialogVisible" width="50%" center>
    <h4>发货单（2835001）详情</h4>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="date" label="发货单号" align="center"></el-table-column>
      <el-table-column prop="name" label="发货状态" align="center"></el-table-column>
      <el-table-column prop="name" label="需求数量" align="center"></el-table-column>
      <el-table-column prop="name" label="上架数量" align="center"></el-table-column>
      <el-table-column prop="name" label="租单时间" align="center"></el-table-column>
    </el-table>
    <h4>SKU明细</h4>
    <el-table :data="tableData1" style="width: 100%" border max-height="200px">
      <el-table-column prop="date" label="SKU" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="订单号" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="商家SKU" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="120px" align="center"></el-table-column>
      <el-table-column prop="name" label="图片" width="100px" align="center"></el-table-column>
      <el-table-column prop="name" label="销售属性" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="订单需求量" width="90px" align="center"></el-table-column>
      <el-table-column prop="num" label="实际发货数量" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.num" :controls="false"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="上架数量" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="供货价（￥）" width="100px" align="center"></el-table-column>
      <el-table-column prop="name" label="总金额（￥）" width="100px" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  name: 'ShippingDetails',
  data () {
    return {
      dialogVisible: true,
      tableData: [],
      tableData1: [{ date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }, { date: '19647064', name: '12321', num: '312' }]
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  height: 500px;
}
/deep/ .el-input-number--small {
  width: 80px;
}
h4 {
  margin: 8px 0;
}
</style>
