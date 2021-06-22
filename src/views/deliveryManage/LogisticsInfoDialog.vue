<template>
    <el-dialog
        title="物流信息"
        :visible.sync="isShowLogistics"
        width="40%"
        center
        class="logistics-dialog"
    >
        <div class="content">
            <div style="margin-bottom:10px;">
                <el-link type="primary" @click="print" v-if="orderStatus<5">物流条码打印</el-link>
            </div>
            <div class="bar-code-wrap">
                <div class="print" id="printMe_logisticsNumber">
                    <div class="tit">物流单号</div>
                    <div>
                        <svg class="barcodeSvg" />
                    </div>
                    <div class="logisticsNumber">{{logisticsInfo.logisticsNumber}}</div>
                </div>
            </div>
            <h3>物流信息</h3>
            <div class="logistics-info">
                <div class="line-hight32">
                    <p>物流单号：{{logisticsInfo.logisticsNumber}}（{{logisticsInfo.logisticsCompanyName}}）</p>
                    <p>发货时间：{{logisticsInfo.deliveryTime}}</p>
                </div>
                <div class="line-hight32">
                    <p>发货单号：{{logisticsInfo.orderNumber}}</p>
                    <p>签收时间：{{logisticsInfo.submissionTime}}</p>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" border max-height="240px">
                <el-table-column prop="date" label="时间" width="140px" align="center"></el-table-column>
                <el-table-column prop="content" label="物流信息" align="center"></el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>
<script>
import JsBarcode from 'jsbarcode'
import SlPrint from '@/shared/util/printarea.js'
export default {
  name: 'LogisticsInfo',
  data () {
    return {
      isShowLogistics: false,
      logisticsInfo: {},
      tableData: [],
      orderStatus: -1
    }
  },
  methods: {
    show (data, orderStatus) {
      this.orderStatus = orderStatus
      this.logisticsInfo = data.row
      this.isShowLogistics = data.isShowLogistics
      this.tableData = data.info ? data.info.trackingInfoDetailList : []

      this.$nextTick(() => {
        JsBarcode(`.barcodeSvg`, this.logisticsInfo.logisticsNumber, {
          height: 70,
          width: 1,
          fontSize: 0,
          margin: 0
        })
      })
    },
    print () {
      const vm = this
      let sl = new SlPrint({
        ids: '#printMe_logisticsNumber',
        endCallback () {
          vm.$emit('printed')
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
<style lang="scss" scoped>
.logistics-dialog {
    /deep/.el-dialog {
        height: 460px;
        /deep/ .el-dialog__body {
            padding: 0px 25px 30px;
        }
    }
}
.logistics-info {
    margin: 16px 0;
    display: flex;
    justify-content: space-between;
    .line-hight32 {
        line-height: 20px;
    }
}
.bar-code-wrap {
    overflow: hidden;
    clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px);
    display: none;
}
.print {
    width: 58mm;
    height: 38mm;
    padding: 1mm;
    text-align: center;
    .tit {
        font-size: 18px;
        margin-bottom: 5px;
        margin-top: 10px;
    }
    .logisticsNumber {
        font-size: 14px;
        line-height: 30px;
    }
}
</style>
