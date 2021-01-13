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
    >
      <div slot="search">
        <SlSearchForm ref="searchForm" v-model="searchQuery" :items="searchItems"></SlSearchForm>
      </div>
      <div class="switch-nav">
        <el-menu
          :default-active="activeIndex"
          class="color-bg--white"
          mode="horizontal"
          @select="switchNav"
        >
          <el-menu-item index="0">全部({{tableData.length}})</el-menu-item>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="发货单号" width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderRequireNum" label="订单需求数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="deliveryNum" label="实际发货数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="totalPrice" label="总金额（￥）" width="100px" align="center"></el-table-column>
        <el-table-column prop="shelvedNum" label="上架数量" width="120px" align="center"></el-table-column>
        <el-table-column label="最晚交货时间" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lastDeliveryTimeS*1000 | dateFormat('yyyy-MM-dd HH:mm:ss')}}</span>
            <span>还剩下：{{parseInt((Date.parse(new Date)-scope.row.lastDeliveryTimeS * 1000)/1000/3600/24)}}天</span>
          </template>
        </el-table-column>
        <el-table-column label="最晚交货时间" width="200px" align="center">
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
            <p>
              物流单号：
              <a>{{scope.row.logisticsNumber}}</a>
            </p>
            <el-button
              type="primary"
              @click="modifyLogistNo(scope.row)"
            >{{scope.row.logisticsNumber ? '修改物流单号':'添加物流单号'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button @click="odmDetail(scope.row,'modify')" type="text">修改</el-button>
            <el-button @click="odmDetail(scope.row,'see')" type="text">查看</el-button>
            <el-button @click="exportExcle" type="text">导出表格</el-button>
            <el-button @click="printOrder(scope.row)" type="text">打印发货单</el-button>
            <el-button @click="printBatch(scope.row)" type="text">打印批次号</el-button>
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
import logisticsInfo from './LogisticsInfoDialog'
import PrintBatchNo from './PrintBatchNo'
import PrintInvoice from './PrintInvoice'
import ModifyLogisticsNo from './ModifyLogisticsNoDialog'
import ShippingDetails from './ShippingDetailsDiaolog'
import GoodsUrl from '@api/goods/goodsUrl.js'
import GOODS_API from '@api/goods'
const pickerOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '昨天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近15天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近30天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近90天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
}
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
          name: 'orderNumber'
        },
        {
          type: 'input',
          label: '供方货号',
          name: 'supplierItemNumber'
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
            isBlock: true,
            pickerOptions: pickerOptions
          }
        },
        {
          type: 'date',
          label: '最晚收货时间',
          name: 'uTime',
          data: {
            datetype: 'daterange',
            pickerOptions: pickerOptions,
            isBlock: true
          }
        },
        {
          type: 'single-select',
          label: '订单状态',
          name: 'orderState',
          data: {
            remoteUrl: GoodsUrl.statusList,
            params: { dataCode: 'INVOICE_STATUS_ENUM' } // PURCHASE_ORDER_STATE
          }
        }
      ],
      navInfo: {},
      tableData: [],
      activeIndex: '0'
    }
  },
  methods: {
    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },

    gotoPage (pageSize = 10, pageIndex = 1) {
      this.$refs.listView.loading = false
    },

    handleSelectionChange (val) {
      console.log(val)
    },

    switchNav (val) {
      console.log(val)
    },

    getInvoiceList (params) {
      GOODS_API.invoiceList(params).then(res => {
        if (res) {
          let data = res.data
          this.page.pageIndex = data.pageIndex
          this.page.pageSize = data.pageSize
          this.page.total = data.total
          this.tableData = data.deliveryOrderList
          this.navInfo = { totalWaitOneDay: data.totalWaitOneDay, totalWait: data.totalWait, totalWaitTwoDay: data.totalWaitTwoDay, totalWaitThreeDay: data.totalWaitThreeDay }
        }
      })
    },

    async openLogistisInfoDialog (row) {
      let params = Object.assign({ isShowLogistics: true }, row)
      this.$refs.logisticsInfo.show(params)
    },

    async odmDetail (row, type) {
      let res = await GOODS_API.getInvoiceDetail(row.id)
      if (res) {
        let data = { type: type, dialogVisible: true, row: row, shippingDeatils: res.data }
        if (type === 'modify') {
          data.onClick = (data) => {
            row.deliveryNum = data
          }
        }
        this.$refs.shippingDetail.show(data)
      }
    },

    async modifyLogistNo (row) {
      let res = await GOODS_API.logisticsCompany()
      if (res) {
        let arr = res.data
        let data = Object.assign({
          onClick: (data) => {
            row.logisticsNumber = data
          }
        }, { showDiaolog: true, row: row, companyList: arr })
        this.$refs.logisticsNo.show(data)
      }
    },

    printBatch (row) {
      GOODS_API.printNo(row.id).then(data => {
        if (data) {
          this.$refs.printBatch.show(data)
        }
      })
    },

    async printOrder (row) {
      let res = await GOODS_API.printInvoice(row.id)
      console.log(res)
      // if (res.success) {
      //   console.log(res)
      //   // this.$refs.printInvoice.show(res.data)
      // }
    },

    exportExcle () {
    }
  },

  mounted () {
    this.getInvoiceList(this.page)
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
