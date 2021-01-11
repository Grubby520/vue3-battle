<template>
  <div>
    <!-- <el-dialog :title="title" :visible.sync="visible" :lock-scroll="false" :close-on-click-modal="false"
    @opened="handleOpened" append-to-body width="450px">-->
    <div class="sku-container-purchase">
      <div class="sku-print" ref="print" id="printMe">
        <div
          class="sku-info batch-no-print"
          v-for="(item, index) in skuArr"
          :key="index"
          style="width: 59.5mm; height: 39mm; background: #fff; overflow: hidden; page-break-after: always; padding-top:1mm; padding-right: 1mm;
                        padding-left: 1mm; margin-top:0!important; position:relative;"
        >
          <ul
            class="batch-cnt"
            style="list-style-type: none; padding:0; margin: 0; text-align:center;"
          >
            <li style="font-size: 18px!important;">{{item.skuCode}}</li>
            <li>
              <div class="barcode">
                <svg :class="'barcodeSvg'+index" />
              </div>
            </li>
          </ul>
          <ul
            class="bill-number"
            style="font-size: 7.5pt!important; list-style-type: none; margin: -1mm 0 0 0; padding:0;"
          >
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm; word-break:break-all;"
            >Att:{{item.productVariantAttributes && item.productVariantAttributes.join('/') || ''}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >Loc:{{item.locationCode || ''}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >TNumber:{{ item.purchaseBatchNo || ''}}</li>
            <li
              style="text-align: right; line-height: 1.1; margin-bottom:0.5mm;"
            >PrintTime:{{item.printedAt || ''}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'
import chineseToPinyin from '@/shared/util/chineseToPinyin'
export default {
  name: 'printBatchNo',
  data () {
    return {
      title: '打印批次号',
      skuArr: [],
      visible: false
    }
  },
  methods: {
    show (data) {
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
      }
    },
    toPrint () {
      const vm = this
      let sl = new SlPrint({
        ids: '#printMe',
        endCallback () {
          console.log(1231)
        }
      })
      setTimeout(function () {
        vm.$nextTick(() => {
          sl.init()
        })
      }, 1000)
    }
  }
}
</script>
<style media="print" type="text/css">
@media print {
  @page {
    size: 59.5mm 39mm;
    margin: 0 auto;
  }
  .bill-number {
    font-size: 7.5pt;
  }
  ul {
    padding: 0;
    margin: 0;
  }
}
</style>
<style lang='scss' >
.z-index.sku-print {
  z-index: 9999 !important;
}
</style>
<style scoped lang="scss">
.sku-container-purchase {
  position: absolute;
  width: 59.5mm;
  height: 38mm;
  overflow: hidden;
  margin: 0 auto 25px auto;
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px);
}
</style>
