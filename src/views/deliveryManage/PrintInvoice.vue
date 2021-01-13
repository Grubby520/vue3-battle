<template>
  <div>
    <div class="sku-container" style="display:none">
      <div class="sku-print" id="print" ref="print">
        <div class="tittle">
          <h3>商家名：12321</h3>
        </div>
        <div class="info">
          <div>
            <p>发货单ID：123</p>
            <p>组单时间：12321321</p>
            <p>需到货时间：3213213213</p>
            <p>采购员：3213</p>
          </div>
          <div>
            <p>SPU总数：</p>
            <p>需求总件数：</p>
            <p>需求实际发货数量</p>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="图片" align="center"></el-table-column>
          <el-table-column prop="name" label="SPU" align="center"></el-table-column>
          <el-table-column prop="name" label="SKU" align="center"></el-table-column>
          <el-table-column prop="name" label="sku颜色" align="center"></el-table-column>
          <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="name" label="上架吊牌尺" align="center"></el-table-column>
          <el-table-column prop="name" label="需求总量" align="center"></el-table-column>
          <el-table-column prop="name" label="实际发货数量" align="center"></el-table-column>
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
      title: '打印发货单',
      skuArr: [],
      tableData: [{ date: 123123, name: '12321321' }],
      visible: false
    }
  },
  methods: {
    show () {
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
.sku-container-purchase {
  position: relative;
  left: -10px;
  overflow: hidden;
  margin: 0 auto 25px auto;
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px);
}
</style>
