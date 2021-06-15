<template>
  <div>
    <div class="list-container" v-show="visible">
      <div class="list-print" ref="print" id="printMe">
        <div
          v-for="(item, index) in list"
          :key="'index_'+index"
          style="width: 59mm; height: 38mm; background: #fff; overflow: hidden; page-break-after: always; padding-top:1mm; padding-right: 0mm;
                        padding-left: 0; margin-top:0!important; position:relative;"
        >
          <ul style="list-style-type: none; padding:0; margin: 0; text-align:center;">
            <li
              style="padding-bottom:1mm;font-size: 16px!important;word-break: break-all;"
            >{{item.logisticsNumber}}</li>
            <li>
              <div class="barcode">
                <svg :class="'barcodeSvg'+index" />
              </div>
            </li>
          </ul>
          <ul
            class="detail-info"
            style="font-size: 6.5pt!important; list-style-type: none; margin: 0.1mm 2mm 0 0; padding:0;"
          >
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.1mm; word-break:break-all;"
            >SKU数:{{item.skuNum}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >发货总件数:{{item.deliverGoodsNum}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >{{item.supplierName}}</li>
            <li style="text-align: right; line-height: 1.1;">发货时间:{{item.deliveryAt}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'

export default {
  name: 'BoxingInvoicePrint',
  data () {
    return {
      title: '打印装箱单',
      list: [],
      visible: false
    }
  },
  methods: {
    show (data = []) {
      this.appendStyle()
      this.visible = true
      this.list = data || []
      if (data.length > 0) {
        setTimeout(() => {
          this.list.forEach((item, index) => {
            JsBarcode('.barcodeSvg' + index, item.logisticsNumber, {
              height: 35,
              fontSize: 0,
              margin: 0
            })
          })
          this.toPrint()
        })
      }
    },
    toPrint () {
      const vm = this
      let sl = new SlPrint({
        ids: '#printMe',
        endCallback () {
          let listA = document.getElementById('list-b')
          if (listA) {
            listA.parentNode.removeChild(document.getElementById('list-b'))
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
          size: 59.5mm 40mm;
          margin: 0 auto;
        }
        .detail-info {
          font-size: 6.5pt;
        }
        ul {
          padding: 0;
          margin:0;
        }
      }
      `
      var head = document.head || document.getElementsByTagName('head')[0]
      var style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.id = 'list-b'
      style.appendChild(document.createTextNode(css))
      head.appendChild(style)
    }
  }
}
</script>
<style lang='scss' >
.z-index.list-print {
  z-index: 9999 !important;
}
</style>
<style scoped lang="scss">
.list-container {
  position: absolute;
  top: 0;
  z-index: -11111;
  width: 59.5mm;
  height: 38mm;
  overflow: hidden;
  margin: 0 auto 0 auto;
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px);
}
</style>
