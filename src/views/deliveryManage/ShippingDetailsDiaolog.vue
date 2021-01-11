<template>
  <el-dialog :visible.sync="dialogVisible" width="50%" center>
    <h4>发货单（2835001）详情</h4>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="orderNumber" label="发货单号" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="发货状态" align="center">
        <template slot-scope="scope">{{statusList[scope.row.orderStatus]}}</template>
      </el-table-column>
      <el-table-column prop="orderRequireNum" label="需求数量" align="center"></el-table-column>
      <el-table-column prop="shelvedNum" label="上架数量" align="center"></el-table-column>
      <el-table-column prop="singleTime" label="组单时间" align="center"></el-table-column>
    </el-table>
    <h4>SKU明细</h4>
    <el-table :data="shippingDeatilData" style="width: 100%" border max-height="200px">
      <el-table-column prop="skuCode" label="SKU" width="80px" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="订单号" width="80px" align="center"></el-table-column>
      <el-table-column prop="supplierSkuCode" label="商家SKU" width="80px" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="120px" align="center"></el-table-column>
      <el-table-column label="图片" width="100px" align="center">
        <template slot-scope="scope">
          <SlImage size="8rem" :src="scope.row.itemImage" />
        </template>
      </el-table-column>
      <el-table-column prop="attributesName" label="销售属性" width="80px" align="center"></el-table-column>
      <el-table-column prop="requireNum" label="订单需求量" width="90px" align="center"></el-table-column>
      <el-table-column prop="deliveryNum" label="实际发货数量" width="120px" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.deliveryNum" :controls="false"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="shelvedNum" label="上架数量" width="80px" align="center"></el-table-column>
      <el-table-column prop="purchasePrice" label="供货价（￥）" width="100px" align="center"></el-table-column>
      <el-table-column prop="totalPurchasePrice" label="总金额（￥）" width="100px" align="center"></el-table-column>
    </el-table>
    <div slot="footer" v-if="this.type == 'modify'">
      <el-button type="primary" plain @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep as _cloneDeep } from 'lodash'
export default {
  name: 'ShippingDetails',
  data () {
    return {
      dialogVisible: false,
      type: 'see',
      statusList: ['待发货', '已发货', '已到货', '异常到货', '已完成'],
      tableData: [],
      originData: [],
      shippingDeatilData: [{ date: '19647064', src: 'http://srm-storage-test.oss-cn-shanghai.aliyuncs.com/srm/goods/prodcut/1609148703-62dc5530-64a3-4483-b509-18e6714aa66c.jpeg', name: '12321', num: '312' }]
    }
  },
  methods: {
    show (data) {
      console.log(data)
      this.tableData = [].concat(data.row)
      this.shippingDeatilData = data.shippingDeatils
      this.originData = _cloneDeep(data.shippingDeatils)
      this.type = data.type
      this.dialogVisible = data.dialogVisible
    },

    save () {

    }
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
