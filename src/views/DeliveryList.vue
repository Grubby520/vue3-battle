<template>
  <div class="delivery-list">
    <div class="delivery-introduce">
      <div class="deliver-info delivery-introduce-bg">
        <p>商家发货须知：</p>
        <p>1、每个发货单务必打一个包裹，对应一个物流单号，包裹内必须添加纸质发货清单，切勿将不同发货单商品混合打包发货。</p>
        <p>2、商家填错发货单号、快递单号，商家发货颜色、尺码、款式、细节与需求不符，按照退件处理，回寄费用商家负担，请商家严把商品质量。</p>
        <p>3、每个发货单SKU款数不超过50款，SKU件数不超过200件。</p>
        <p>4、自发货当日起超过15天未被仓库签收的发货单将自动关闭。关闭的发货单仓库不再签收做退回处理。</p>
      </div>
      <div class="warehouse-address delivery-introduce-bg">
        <p>仓库地址：广东省东莞市黄江镇星光村朝阳路1号朝阳家具厂内5号仓库-京东_20001673</p>
        <p>联系方式：13662988650</p>
      </div>
    </div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div slot="search">
        <SlSearchForm ref="searchForm" v-model="searchQuery" :items="searchItems"></SlSearchForm>
      </div>
      <el-button type="primary" @click="batchPrintNo">批量导出批次号</el-button>
      <div class="switch-nav">
        <el-menu
          :default-active="activeIndex"
          class="color-bg--white"
          mode="horizontal"
          @select="switchNav"
        >
          <el-menu-item index="0">全部({{count}})</el-menu-item>
          <el-menu-item index="1">全部待发货({{navInfo.totalWait}})</el-menu-item>
          <el-menu-item index="2">1日未发货({{navInfo.totalWaitOneDay}})</el-menu-item>
          <el-menu-item index="3">2日未发货({{navInfo.totalWaitTwoDay}})</el-menu-item>
          <el-menu-item index="4">3日未发货({{navInfo.totalWaitThreeDay}})</el-menu-item>
        </el-menu>
      </div>
      <el-table
        :data="tableData"
        border
        size="mini"
        ref="multipleTable"
        class="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
        <el-table-column prop="date" label="发货单号" width="120px" align="center">
          <template slot-scope="scope">
            <el-button @click="odmDetail(scope.row,'see')" type="text">{{scope.row.orderNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderRequireNum" label="订单需求数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="deliveryNum" label="实际发货数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="totalPrice" label="总金额（￥）" width="100px" align="center"></el-table-column>
        <el-table-column label="状态" width="80px" align="center">
          <template slot-scope="scope">{{orderStatusList[scope.row.orderStatus]}}</template>
        </el-table-column>
        <el-table-column prop="shelvedNum" label="上架数量" width="120px" align="center"></el-table-column>
        <el-table-column label="最晚交货时间" width="180px" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.lastDeliveryTimeS*1000 | dateFormat('yyyy-MM-dd')}}</p>
            <p
              style="color:red"
              v-if="Math.ceil((scope.row.lastDeliveryTimeS * 1000 - Date.parse(new Date) )/1000/3600/24) > 0"
            >还剩下：{{Math.ceil((scope.row.lastDeliveryTimeS * 1000 - Date.parse(new Date) )/1000/3600/24)}}天</p>
          </template>
        </el-table-column>
        <el-table-column label="进度时间" width="200px" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.singleTime">组单时间：{{scope.row.singleTime}}</p>
            <p v-if="scope.row.deliveryTime">发货时间：{{scope.row.deliveryTime}}</p>
            <p v-if="scope.row.submissionTime">签收时间：{{scope.row.submissionTime}}</p>
            <p v-if="scope.row.completeTime">完成时间：{{scope.row.completeTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="settleOrderNumber" label="结算单ID" width="100px" align="center"></el-table-column>
        <el-table-column prop="logisticsNumber" label="物流信息" width="180px" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.logisticsNumber">
              物流单号：
              <el-button
                @click="openLogistisInfoDialog(scope.row)"
                type="text"
              >{{scope.row.logisticsNumber}}</el-button>
            </p>
            <el-button
              type="primary"
              @click="modifyLogistNo(scope.row)"
              v-if="[0,1].includes(Number(scope.row.orderStatus))"
            >{{scope.row.logisticsNumber ? '修改物流单号':'添加物流单号'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button
              @click="odmDetail(scope.row,'modify')"
              type="text"
              v-if="[0,1].includes(Number(scope.row.orderStatus))"
            >修改</el-button>-->
            <el-button @click="odmDetail(scope.row,'see')" type="text">查看</el-button>
            <el-button
              @click="exportExcle(scope.row)"
              type="text"
              v-if="scope.row.orderStatus != 5"
            >导出表格</el-button>
            <el-button
              @click="printOrder(scope.row)"
              type="text"
              v-if="scope.row.orderStatus != 5"
            >打印发货单</el-button>
            <el-button
              @click="printBatch(scope.row)"
              type="text"
              v-if="scope.row.orderStatus != 5"
            >打印批次号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </SlListView>
    <!-- 物流信息dialog -->
    <logistics-info ref="logisticsInfo"></logistics-info>
    <!-- 修改物理单号 -->
    <modify-logistics-no ref="logisticsNo"></modify-logistics-no>
    <!-- 发货单详情 -->
    <shipping-details ref="shippingDetail"></shipping-details>
    <print-batch-no ref="printBatch"></print-batch-no>
    <print-invoice ref="printInvoice"></print-invoice>
  </div>
</template>

<script>
import logisticsInfo from './deliveryManage/LogisticsInfoDialog'
import PrintBatchNo from './deliveryManage/PrintBatchNo'
import PrintInvoice from './deliveryManage/PrintInvoice'
import ModifyLogisticsNo from './deliveryManage/ModifyLogisticsNoDialog'
import ShippingDetails from './deliveryManage/ShippingDetailsDiaolog'
import GoodsUrl from '@api/goods/goodsUrl.js'
import GOODS_API from '@api/goods'
import { exportFileFromRemote, date } from '@shared/util'
import { Message } from 'element-ui'
import { find as _find } from 'lodash'
export default {
  name: 'DeliveryList',
  components: { logisticsInfo, ModifyLogisticsNo, ShippingDetails, PrintBatchNo, PrintInvoice },
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      searchQuery: {},
      searchItems: [
        {
          type: 'input',
          label: '发货单号',
          name: 'deliveryNumber'
        },
        {
          type: 'input',
          label: '订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: 'SKU',
          name: 'sku'
        },
        {
          type: 'date',
          label: '组单时间',
          name: 'cTime',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        },
        {
          type: 'date',
          label: '最晚交货时间',
          name: 'uTime',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        },
        {
          type: 'single-select',
          label: '订单状态',
          name: 'status',
          data: {
            remoteUrl: GoodsUrl.statusList,
            params: { dataCode: 'INVOICE_STATUS_ENUM' } // PURCHASE_ORDER_STATE
          }
        }
      ],
      orderStatusList: ['待发货', '已发货 ', '已到货', '异常到货', '已完成', '已取消'],
      navInfo: {},
      tableData: [],
      activeIndex: '0',
      selectdChange: [],
      count: 0,
      selectionsDisabled: []
    }
  },

  methods: {
    checkSelectable (row) {
      return row.orderStatus !== 5
    },

    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },

    gotoPage (pageSize = 10, pageIndex = 1) {
      let params = this.getParams(pageSize, pageIndex)
      if (this.activeIndex > 0) {
        delete params.status
        params.type = this.activeIndex
      }
      GOODS_API.invoiceList(params).then(res => {
        if (res.success) {
          let data = res.data
          this.page.pageIndex = data.pageIndex
          this.page.pageSize = data.pageSize
          this.page.total = data.total
          this.count = data.count
          this.tableData = data.deliveryOrderList
          this.navInfo = { totalWaitOneDay: data.totalWaitOneDay, totalWait: data.totalWait, totalWaitTwoDay: data.totalWaitTwoDay, totalWaitThreeDay: data.totalWaitThreeDay }
        } else {
          Message({
            type: 'error',
            message: res.error.message
          })
        }
      }).finally(() => {
        this.$refs.listView.loading = false
      })
    },

    handleSelectionChange (val) {
      this.selectdChange = val
    },

    switchNav (val) {
      let arr = _find(this.searchItems, { name: 'status' })
      this.activeIndex = val
      if (val > 0) {
        if (arr) {
          this.searchItems.pop()
        }
      } else {
        if (!arr) {
          let obj = {
            type: 'single-select',
            label: '订单状态',
            name: 'status',
            data: {
              remoteUrl: GoodsUrl.statusList,
              params: { dataCode: 'INVOICE_STATUS_ENUM' } // PURCHASE_ORDER_STATE
            }
          }
          this.searchItems.push(obj)
        }
      }
      let params = this.getParams(10, 1)
      if (val > 0) {
        delete params.status
        params.type = val
      }
      this.getInvoiceList(params)
    },

    getParams (pageSize, pageIndex) {
      let [singleTimeStart, singleTimeEnd] = ['', '']
      let [latestDeliveryTimeStart, latestDeliveryTimeEnd] = ['', '']
      if (this.searchQuery.cTime) {
        [singleTimeStart, singleTimeEnd] = this.searchQuery.cTime
      }
      if (this.searchQuery.uTime) {
        [latestDeliveryTimeStart, latestDeliveryTimeEnd] = this.searchQuery.uTime
      }
      let params = Object.assign({ singleTimeStart, singleTimeEnd, latestDeliveryTimeStart, latestDeliveryTimeEnd }, this.searchQuery)
      delete params.cTime
      delete params.uTime
      params.pageSize = pageSize
      params.pageIndex = pageIndex
      return params
    },

    getInvoiceList (params) {
      GOODS_API.invoiceList(params).then(res => {
        if (res) {
          let data = res.data
          this.page.pageIndex = data.pageIndex
          this.page.pageSize = data.pageSize
          this.page.total = data.total
          this.count = data.count
          this.tableData = data.deliveryOrderList
          this.navInfo = { totalWaitOneDay: data.totalWaitOneDay, totalWait: data.totalWait, totalWaitTwoDay: data.totalWaitTwoDay, totalWaitThreeDay: data.totalWaitThreeDay }
        }
      })
    },

    async openLogistisInfoDialog (row) {
      let params = {
        logisticsNumber: row.logisticsNumber,
        logisticsCompanyName: row.logisticsCompanyName,
        logisticsCompanyCode: row.courierCode
      }
      let res = await GOODS_API.getLogisticsInfo(params)
      if (res.success) {
        let data = { isShowLogistics: true, info: res.data[0], row: row }
        this.$refs.logisticsInfo.show(data)
      } else {
        Message({
          message: res.error.message,
          type: 'error'
        })
      }
    },

    async odmDetail (row, type) {
      let res = await GOODS_API.getInvoiceDetail(row.id)
      if (res.success) {
        let data = { type: type, dialogVisible: true, row: row, shippingDeatils: res.data }
        if (type === 'modify') {
          data.onClick = (data) => {
            row.deliveryNum = data
          }
        }
        this.$refs.shippingDetail.show(data)
      } else {
        Message({
          message: res.error.message,
          type: 'error'
        })
      }
    },

    async modifyLogistNo (row) {
      let res = await GOODS_API.logisticsCompany()
      if (res.success) {
        let arr = res.data
        let data = Object.assign({
          onClick: (data) => {
            row.logisticsNumber = data.logisticsNumber
            row.courierCode = data.courierCode
            row.courierName = data.courierName
            row.logisticsCompanyName = data.logisticsCompanyName
            row.logisticsCompanyId = data.logisticsCompanyId
            row.orderStatus = data.type
          }
        }, { showDiaolog: true, row: row, companyList: arr })
        this.$refs.logisticsNo.show(data)
      } else {
        Message({
          message: res.error.message,
          type: 'error'
        })
      }
    },

    printBatch (row) {
      GOODS_API.printNo(row.id).then(data => {
        if (data.success) {
          this.$refs.printBatch.show(data.data)
        } else {
          Message({
            message: data.error.message,
            type: 'error'
          })
        }
      })
    },

    async printOrder (row) {
      let res = await GOODS_API.printInvoice(row.id)
      if (res.success) {
        this.$refs.printInvoice.show(res.data)
      } else {
        Message({
          message: res.error.message,
          type: 'error'
        })
      }
    },

    exportExcle (row) {
      exportFileFromRemote({
        url: GoodsUrl.ecxportExcle + '?deliveryOrderId=' + row.id,
        name: `发货单详情_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`,
        beforeLoad: () => {
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
        },
        afterLoad: () => {
          this.selections = []
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    },

    batchPrintNo () {
      if (this.selectdChange.length > 0) {
        let arr = []
        this.selectdChange.forEach((item) => {
          arr.push(item.id)
        })
        exportFileFromRemote({
          url: GoodsUrl.printNo,
          name: `批量导出批次号.zip`,
          params: { ids: arr.join(',') },
          beforeLoad: () => {
            this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
          },
          afterLoad: () => {
            this.selections = []
            this.$store.dispatch('CLOSE_LOADING')
          },
          successFn: () => { },
          errorFn: () => { }
        })
        // GOODS_API.batchPrintNo({ ids: arr.join(',') })
      } else {
        Message({
          message: '请至少选择一条发货记录',
          type: 'warning'
        })
      }
    }
  },

  mounted () {
    // this.getInvoiceList(this.page)
  }
}
</script>

<style lang="scss" scoped>
.delivery-list {
  width: 100%;
  .delivery-introduce {
    font-size: 12px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .delivery-introduce-bg {
      background: #fdf6ec;
      border-radius: 4px;
    }
    .deliver-info {
      width: 60%;
      padding: 20px;
    }
    .warehouse-address {
      width: 30%;
      padding: 40px 20px;
    }
  }
  .tableData {
    &-col {
      &-img {
        width: 10rem;
        height: 10rem;
        margin-right: 1rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      &-pre {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-con {
        text-align: left;
      }
    }
    /deep/ .cell {
      text-align: center;
    }
  }
}
</style>
