<template>
  <div>
    <div class="sku-container" style="display:none">
      <div class="sku-print" id="print" ref="print">
        <div class="tittle">
          <h3>商家名：12321</h3>
          <div class="barcode">
            <!-- <svg :class="'barcodeSvg'+index" /> -->
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
            <p>需求总件数：</p>
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
          <el-table-column prop="skuColor" label="sku颜色" align="center" width="80px"></el-table-column>
          <el-table-column prop="skuSize" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="merchantDropSize" label="上架吊牌尺" align="center" width="100px"></el-table-column>
          <el-table-column prop="requireNum" label="需求总量" align="center"></el-table-column>
          <el-table-column prop="deliveryGoodsNum" label="实际发货数量" align="center" width="100px"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
// import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'
export default {
  name: 'PrintInvoice',
  data () {
    return {
      info: {},
      tableData: [],
      visible: false
    }
  },
  methods: {
    show (data) {
      this.info = data
      this.appendStyle()
      this.toPrint()
    },

    toPrint () {
      const vm = this
      let sl = new SlPrint({
        ids: '#print',
        endCallback () {
          let listA = document.getElementById('list-a')
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
            margin: 0 auto;
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

<style media="print" type="text/css" scoped>
.sku-container {
  @media print {
    @page {
      size: A4;
      margin: 0 auto;
    }
  }
}
</style>
<style scoped lang="scss">
.sku-print {
  margin-top: 20px;
  width: 100%;
  .tittle {
    text-align: center;
    h3 {
      font-size: 28px;
    }
  }
  .info {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
</style>
