<template>
  <div class="sku-container" v-show="false">
    <div class="sku-print" id="print-a" ref="print">
      <div class="tittle">
        <h3>商家名：{{info.merchantName}}</h3>
        <div class="barcode">
          <p>{{info.deliveryNum}}</p>
          <svg class="barcodeSvg" />
        </div>
      </div>
      <div class="info">
        <div>
          <p>发货单ID：{{info.deliveryNum}}</p>
          <p>组单时间：{{info.combineTime}}</p>
          <p>需到货时间：{{info.requireTime}}</p>
          <p>采购员：{{info.operateName}}</p>
        </div>
        <div>
          <p>SPU总数：{{info.spuTotal}}</p>
          <p>需求总件数：{{info.requireNum}}</p>
          <p>需求实际发货数量：{{info.deliveryGoodsNum}}</p>
        </div>
      </div>
      <el-table :data="info.items" style="width: 100%" border>
        <el-table-column label="图片" align="center" width="120px">
          <template slot-scope="scope">
            <SlImage size="8rem" :src="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column prop="spu" label="SPU" align="center"></el-table-column>
        <el-table-column prop="sku" label="SKU" align="center"></el-table-column>
        <el-table-column prop="skuAttribute" label="SKU销售属性" align="center" width="80px"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="merchantDropSize" label="商家吊牌尺码" align="center" width="100px"></el-table-column>
        <el-table-column prop="requireNum" label="需求总量" align="center"></el-table-column>
        <el-table-column prop="deliveryGoodsNum" label="实际发货数量" align="center" width="100px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'
import { cloneDeep as _cloneDeep } from 'lodash'

export default {
  name: 'PrintInvoice',
  data () {
    return {
      info: {},
      visible: false
    }
  },
  methods: {
    show (data) {
      this.info = _cloneDeep(data)
      this.appendStyle()
      JsBarcode('.barcodeSvg', data.deliveryNum, {
        height: 18,
        fontSize: 0,
        margin: 0
      })
      this.toPrint()
    },

    toPrint () {
      const vm = this
      let sl = new SlPrint({
        ids: '#print-a',
        endCallback () {
          let listA = document.getElementById('list-a')
          vm.info = {}
          if (listA) {
            listA.parentNode.removeChild(document.getElementById('list-a'))
          }
        }
      })
      setTimeout(function () {
        vm.$nextTick(() => {
          sl.init()
        })
      }, 1000)
    },

    appendStyle () {
      var css = `
        @media print {
          @page {
            size: A4;
            margin: 20px auto 0;
          }
      }
      `
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.id = 'list-a'
      style.appendChild(document.createTextNode(css))
      head.appendChild(style)
    }
  }
}
</script>
<style scoped lang="scss">
.sku-print {
  width: 100%;
  .tittle {
    text-align: center;
    display: flex;
    justify-content: space-between;
    h3 {
      font-size: 28px;
      text-align: center;
      width: 60%;
    }
    .barcode {
      width: 40%;
    }
  }
  .info {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
// /deep/ .el-table td,
// .el-table th.is-leaf {
//   border: 1px solid #333;
// }

// .el-table--border td,
// .el-table--border th,
// .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
//   border: 1px solid #333;
// }
</style>
