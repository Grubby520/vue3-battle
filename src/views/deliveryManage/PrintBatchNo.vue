<template>
  <div>
    <div class="sku-container-purchase" v-show="visible">
      <div class="sku-print" ref="print" id="printMe">
        <div
          class="sku-info batch-no-print"
          v-for="(item, index) in skuArr"
          :key="index"
          style="width: 59mm; height: 38mm; background: #fff; overflow: hidden; page-break-before: always; padding-top:1mm; padding-right: 0mm;
                        padding-left: 0; margin-top:0!important; position:relative;"
        >
          <ul
            class="batch-cnt"
            style="list-style-type: none; padding:0; margin: 0; text-align:center;"
          >
            <li
              style="padding-bottom:1mm;font-size: 18px!important;word-break: break-all;"
            >{{item.skuCode}}</li>
            <li>
              <div class="barcode">
                <svg :class="'barcodeSvg'+index" />
              </div>
            </li>
          </ul>
          <ul
            class="bill-number"
            style="font-size: 7.5pt!important; list-style-type: none; margin: 0.1mm 2mm 0 0; padding:0;"
          >
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.1mm; word-break:break-all;"
            >Att:{{item.productVariantAttributes && item.productVariantAttributes.join('/') || ''}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >PO:{{item.purchaseOrderNumber || ''}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >TNumber:{{ item.purchaseBatchNo || ''}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'
import chineseToPinyin from '@/shared/util/chineseToPinyin'
export default {
  name: 'PrintBatchNo',
  data () {
    return {
      title: '打印批次号',
      skuArr: [],
      visible: false
    }
  },
  methods: {
    show (data) {
      this.appendStyle()
      this.visible = true
      this.skuArr = []
      if (data) {
        this.skuArr = data
        setTimeout(() => {
          this.skuArr.forEach((item, index) => {
            const _productVariantAttributes =
              item.productVariantAttributes || []
            item.productVariantAttributes = _productVariantAttributes.map(
              (ele) => {
                if (ele) {
                  return chineseToPinyin(ele)
                }
              }
            )
            JsBarcode('.barcodeSvg' + index, item.purchaseBatchNo, {
              height: 35,
              fontSize: 0,
              margin: 0
            })
          })
          this.toPrint()
        })
      } else {
        this.$message({
          message: '批次号不存在，请确认数据无误！',
          type: 'warning',
          customClass: 'z-index sku-print'
        })
        this.visible = false
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
        .bill-number {
          font-size: 7.5pt;
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
.z-index.sku-print {
  z-index: 9999 !important;
}
</style>
<style scoped lang="scss">
.sku-container-purchase {
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
