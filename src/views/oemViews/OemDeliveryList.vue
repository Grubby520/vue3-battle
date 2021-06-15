<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm
          ref="searchForm"
          v-model="formQuery"
          :items="searchItems"
          :loading="loading"
          @reset="reset"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>
      </div>
      <!-- tab切换 -->
      <SlSwitchNav
        align="right"
        :navs="switchNavs"
        :default-active="switchActiveIndex"
        @select="switchNav"
      >
        <template v-slot:left>
          <span class="pdl-2rem">
            <SlButton
              type="primary"
              boxShadow="primary"
              :loading="loading"
              :disabled="!canClick"
              @click="exportFile"
            >批量导出批次号</SlButton>
          </span>
        </template>
        <template v-slot:custom="{tab}">{{tab.tabName}}</template>
      </SlSwitchNav>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        v-model="selections"
        align="left"
        :border="false"
        :tableData="tableData"
        :columns="columns"
        :operate="true"
        :tooltip="false"
        rowKey="id"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="viewDetail(row.id)">查看</el-button>
          <el-button type="text" @click="printInvoice(row.id)">打印发货单</el-button>
          <el-button type="text" @click="printBatchNo(row.id)">打印批次号</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 发货单详情 -->
    <DeliveryDetailDialog ref="deliveryDetailDialog"></DeliveryDetailDialog>
    <!-- 物流信息 -->
    <OemLogisticsInfoDialog ref="logisticsInfoDialog"></OemLogisticsInfoDialog>
    <!-- 打印发货单 -->
    <OemInvoicePrint ref="oemInvoicePrint"></OemInvoicePrint>
    <!-- 打印批次号 -->
    <print-batch-no ref="printBatchNo"></print-batch-no>
  </div>
</template>

<script>
import { exportFileFromRemote, errorMessageTip } from '@shared/util'
import DeliveryDetailDialog from './oemDeliveryList/DeliveryDetailDialog.vue'
import OemLogisticsInfoDialog from './oemDeliveryList/OemLogisticsInfoDialog.vue'
import OemInvoicePrint from './oemDeliveryList/OemInvoicePrint.vue'
import PrintBatchNo from '../components/PrintBatchNo'
import CommonApi from '@api/api.js'
import OemGoodsUrl from '@api/oemGoods/oemGoodsUrl.js'
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'OemDeliveryList',
  components: {
    DeliveryDetailDialog,
    OemLogisticsInfoDialog,
    OemInvoicePrint,
    PrintBatchNo
  },
  data () {
    return {
      loading: false,
      tableData: [],
      selections: [],
      switchNavs: [],
      switchActiveIndex: '0',
      formQuery: {},
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      searchItems: [
        {
          type: 'input',
          label: '发货单号',
          name: 'deliveryOrderNumber'
        },
        {
          type: 'input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: '物流单号',
          name: 'logisticsBillNumber'
        },
        {
          type: 'input',
          label: 'SKU编码',
          name: 'skuCode'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'productName'
        },
        {
          type: 'date',
          label: '发货日期',
          name: 'deliveryTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'deliveryOrderNumber',
          label: '发货单号'
        },
        {
          prop: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          prop: 'deliveryOrderPackageNumber',
          label: '装箱单号'
        },
        {
          prop: 'deliveryQuantity',
          label: '实际发货数量'
        },
        {
          prop: 'inInventoryQuantity',
          label: '入库数量'
        },
        {
          prop: 'lessStockQuantity',
          label: '少货数量'
        },
        {
          prop: 'statusName',
          label: '状态'
        },
        {
          prop: 'logisticsBillNumber',
          label: '物流单号',
          render: (h, data) => {
            let { row = {} } = data
            return <el-button onClick={() => this.viewLogisticsInfo(row)} type="text">{row.logisticsBillNumber}</el-button>
          }
        },
        {
          prop: '',
          label: '操作时间',
          width: '200px',
          render: (h, data) => {
            let { row = {} } = data
            let map = {
              0: {
                label: '发货时间',
                prop: 'createdTime'
              },
              1: {
                label: '签收时间',
                prop: 'updatedTime'
              },
              2: {
                label: '完成时间',
                prop: 'finishedTime'
              }
            }
            if (map[row.status] && row[map[row.status].prop]) {
              return <p>{map[row.status].label}：{row[map[row.status].prop]}</p>
            } else {
              return <span>-</span>
            }
          }
        }
      ]
    }
  },
  computed: {
    canClick () {
      return this.selections.length > 0
    }
  },
  created () {
    this.getSwitchNavs()
  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.loading = true
      OemGoodsAPI.getDeliveryList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.selections = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    reset () {
      this.switchActiveIndex = '0'
      this.gotoPage(this.page.pageSize)
    },
    getSwitchNavs () {
      CommonApi.getDict({ dataCode: 'OEM_INVOICE_STATUS_ENUM' }).then(data => {
        this.switchNavs = data.map(item => {
          return {
            tabName: item.label,
            tabType: item.value
          }
        })
      })
    },
    switchNav (index) {
      this.switchActiveIndex = index
      this.gotoPage()
    },
    exportFile () {
      const ids = this.selections.map(item => item.id)
      exportFileFromRemote({
        url: OemGoodsUrl.genPreInvoiceBatchNoUrl,
        name: `批量导出批次号.zip`,
        params: { ids: ids.join(',') },
        beforeLoad: () => {
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
        },
        afterLoad: () => {
          this.selections = []
          this.gotoPage()
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { errorMessageTip('生成发货单批次号失败,请稍后再试') }
      })
    },
    viewDetail (id) {
      this.$refs.deliveryDetailDialog.openDialog(id)
    },
    viewLogisticsInfo (row) {
      this.$refs.logisticsInfoDialog.openDialog(row)
    },
    printInvoice (id) {
      this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '获取数据中' })
      OemGoodsAPI.genDeliverPrintInfo(id).then(res => {
        let { success, error, data = [] } = res
        if (success) {
          this.$refs.oemInvoicePrint.show(data)
        } else {
          errorMessageTip(error && error.message)
        }
      }).finally(() => {
        this.$store.dispatch('CLOSE_LOADING')
      })
    },
    printBatchNo (id) {
      this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '获取数据中' })
      OemGoodsAPI.genPreInvoiceBatchNo(id).then(res => {
        let { success, error, data = [] } = res
        if (success) {
          this.$refs.printBatchNo.show(data)
        } else {
          errorMessageTip(error && error.message)
        }
      }).finally(() => {
        this.$store.dispatch('CLOSE_LOADING')
      })
    },
    generateParams (pageSize, pageIndex) {
      return {
        ...this.getQureyParams(),
        status: parseInt(this.switchActiveIndex),
        pageIndex,
        pageSize
      }
    },
    getQureyParams () {
      let { orderTimes = [], ...orther } = this.formQuery
      return {
        ...orther,
        orderTimeStart: orderTimes && orderTimes[0] ? orderTimes[0] : '',
        orderTimeEnd: orderTimes && orderTimes[1] ? orderTimes[1] : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
