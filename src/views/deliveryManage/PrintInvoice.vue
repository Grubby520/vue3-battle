<template>
  <div class="sku-container" v-show="false">
    <div class="sku-print" id="print-a" ref="print">
      <div class="tittle">
        <h3>{{info.merchantName}}</h3>
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
          <p>实际发货件数：{{info.deliveryGoodsNum}}</p>
        </div>
      </div>
      <div class="print-table">
        <table style="width: 100%">
          <thead>
            <th>图片</th>
            <th style="width:150px">采购单号</th>
            <th>SPU</th>
            <th>SKU</th>
            <th style="width:150px">SKU销售属性</th>
            <th style="width:200px">商品名称</th>
            <th style="width:100px">商家吊牌尺码</th>
            <th style="width:50px">需求总量</th>
            <th style="width:50px">实际发货数量</th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in info.items" :key="'row_'+index">
              <td>
                <SlImage size="8rem" :src="item.image" />
              </td>
              <td>{{item.purchaseOrderId}}</td>
              <td>{{item.spu}}</td>
              <td>{{item.sku}}</td>
              <td>{{item.skuAttribute}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.merchantTagSize}}</td>
              <td>{{item.requireNum}}</td>
              <td>{{item.deliveryGoodsNum}}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      p {
        margin-bottom: 5px;
      }
    }
  }
  .info {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    line-height: 1.5;
  }

  .print-table {
    table {
      border-collapse: collapse;
      border-spacing: 0;
      border: 1px solid #ebeef5;
    }
    th,
    td {
      line-height: 1.5;
      text-align: center;
      border-top: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
    }

    th {
      padding: 1em;
    }

    td {
      padding: 0.5em;
    }
  }
}
</style>
