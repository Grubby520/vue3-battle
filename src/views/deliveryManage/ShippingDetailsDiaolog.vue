<template>
  <el-dialog :visible.sync="dialogVisible" width="60%" center :before-close="handleClose">
    <h4>发货单（{{shippingDeatilData.orderNumber}}）详情</h4>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="orderNumber" label="发货单号" align="center"></el-table-column>
      <el-table-column label="发货状态" align="center">
        <template slot-scope="scope">{{statusList[scope.row.orderStatus]}}</template>
      </el-table-column>
      <el-table-column prop="orderRequireNum" label="需求数量" align="center"></el-table-column>
      <el-table-column prop="shelvedNum" label="上架数量" align="center"></el-table-column>
      <el-table-column prop="singleTime" label="组单时间" align="center"></el-table-column>
    </el-table>
    <h4>SKU明细</h4>
    <el-table
      :data="shippingDeatilData.deliveryOrderList"
      style="width: 100%"
      border
      max-height="360px"
    >
      <el-table-column prop="skuCode" label="SKU" width="80" align="center"></el-table-column>
      <el-table-column prop="purchaseOrderNum" label="订单号" width="80" align="center"></el-table-column>
      <el-table-column prop="supplierSkuCode" label="商家SKU" width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="200" align="center"></el-table-column>
      <el-table-column label="图片" width="100" align="center">
        <template slot-scope="scope">
          <SlImage size="8rem" :src="scope.row.itemImage" />
        </template>
      </el-table-column>
      <el-table-column prop="attributesName" label="销售属性" width="100" align="center"></el-table-column>
      <el-table-column prop="requireNum" label="订单需求量" width="60" align="center"></el-table-column>
      <el-table-column prop="deliveryNum" label="实际发货数量" width="60" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.deliveryNum" :controls="false" v-if="type=='modify'"></el-input-number>
          <span v-else>{{scope.row.deliveryNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shelvedNum" label="上架数量" width="50" align="center"></el-table-column>
      <el-table-column prop="purchasePrice" label="供货价（￥）" width="60" align="center"></el-table-column>
      <el-table-column prop="totalPurchasePrice" label="总金额（￥）" align="center"></el-table-column>
    </el-table>
    <div slot="footer" v-if="this.type == 'modify'">
      <el-button type="primary" plain @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep as _cloneDeep, differenceBy as _differenceBy, forEach as _forEach } from 'lodash'
import GOODS_API from '@api/goods'
import { Message } from 'element-ui'
export default {
  name: 'ShippingDetails',
  data () {
    return {
      dialogVisible: false,
      type: 'see',
      statusList: ['待发货', '已发货', '已到货', '异常到货', '已完成', '已取消'],
      tableData: [],
      originData: [],
      shippingDeatilData: {},
      onClick: () => { }
    }
  },
  methods: {
    show (data) {
      this.tableData = [].concat(data.row)
      this.shippingDeatilData = _cloneDeep(data.shippingDeatils)
      this.originData = _cloneDeep(data.shippingDeatils)
      this.type = data.type
      this.dialogVisible = data.dialogVisible
      if (data.type === 'modify') {
        this.onClick = data.onClick
      }
    },

    save () {
      let arr = this.diffData()
      if (arr.length > 0) {
        let params = {
          id: this.originData.id,
          list: arr
        }
        GOODS_API.modifyInvoice(params).then(res => {
          if (res.success) {
            let num = this.shippingDeatilData.deliveryOrderList.reduce((sum, item) => {
              return sum + Number(item.deliveryNum)
            }, 0)
            this.onClick(num)
            this.dialogVisible = false
          }
        })
      } else {
        Message({
          showClose: true,
          message: '没做修改',
          type: 'warning'
        })
      }
    },

    diffData () {
      let arr = _differenceBy(this.shippingDeatilData.deliveryOrderList, this.originData.deliveryOrderList, 'deliveryNum')
      let arrList = []
      if (arr.length > 0) {
        _forEach(arr, (item) => {
          let obj = {}
          obj.id = item.id
          obj.deliveryNum = item.deliveryNum
          arrList.push(obj)
        })
      }
      return arrList
    },

    handleClose (done) {
      this.tableData = []
      this.originData = []
      this.shippingDeatilData = {}
      done()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  height: 600px;
}
/deep/ .el-input-number--small {
  width: 80px;
}
h4 {
  margin: 8px 0;
}
</style>
