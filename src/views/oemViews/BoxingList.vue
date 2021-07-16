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
      <SlSwitchNav :navs="switchNavs" :default-active="switchActiveIndex" @select="switchNav"></SlSwitchNav>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        align="left"
        :selection="false"
        :border="false"
        :tableData="tableData"
        :columns="columns"
        :operate="true"
        :tooltip="false"
        rowKey="id"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button class="operation-btn" type="text" @click="viewDetail(row)">查看</el-button>
          <el-button class="operation-btn" type="text" @click="printBoxingInvoice(row)">打印装箱单</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 装箱单详情 -->
    <BoxingInvoiceDetailDialog ref="boxingInvoiceDetailDialog"></BoxingInvoiceDetailDialog>
    <!-- 打印批次号 -->
    <BoxingInvoicePrint ref="boxingInvoicePrint"></BoxingInvoicePrint>
  </div>
</template>

<script>
import { errorMessageTip } from '@shared/util'
import BoxingInvoiceDetailDialog from './boxingList/BoxingInvoiceDetailDialog.vue'
import BoxingInvoicePrint from './boxingList/BoxingInvoicePrint.vue'
import CommonApi from '@api/api.js'
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'BoxingList',
  components: {
    BoxingInvoiceDetailDialog,
    BoxingInvoicePrint
  },
  data () {
    return {
      loading: false,
      tableData: [],
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
          label: '装箱单号',
          name: 'orderNumber'
        },
        {
          type: 'input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: '物流单号',
          name: 'logisticsNumber'
        }
      ],
      columns: [
        {
          prop: 'orderNumber',
          label: '装箱单号'
        },
        {
          prop: 'skuQuantity',
          label: 'SKU数'
        },
        {
          prop: 'deliveryQuantity',
          label: '发货总件数'
        },
        {
          prop: 'statusName',
          label: '状态'
        },
        {
          prop: 'logisticsCompanyName',
          label: '物流商'
        },
        {
          prop: 'logisticsNumber',
          label: '物流单号'
        },
        {
          prop: '',
          label: '操作时间',
          width: '200px',
          render: (h, data) => {
            let { row = {} } = data
            let map = {
              0: [{
                label: '发货时间',
                prop: 'deliveryAt'
              }],
              1: [{
                label: '发货时间',
                prop: 'deliveryAt'
              }, {
                label: '签收时间',
                prop: 'signInAt'
              }],
              2: [{
                label: '取消时间',
                prop: 'updatedAt'
              }]
            }
            if (map[row.status]) {
              return map[row.status].map(item => {
                return <p>{item.label}：{row[item.prop]}</p>
              })
            } else {
              return <span>-</span>
            }
          }
        }
      ]
    }
  },
  computed: {
  },
  created () {
    this.getSwitchNavs()
  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.loading = true
      OemGoodsAPI.getDeliveryPackageList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
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
      CommonApi.getDict({ dataCode: 'OEM_DELIVERY_PACKAGE_STATUS_ENUM' }).then(data => {
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
    viewDetail ({ orderNumber }) {
      this.$refs.boxingInvoiceDetailDialog.openDialog(orderNumber)
    },
    printBoxingInvoice ({ orderNumber }) {
      this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '获取数据中' })
      OemGoodsAPI.getDeliveryPackagePrintInfo({ orderNumber }).then(res => {
        let { success, error, data = {} } = res
        if (success) {
          this.$refs.boxingInvoicePrint.show([data])
        } else {
          errorMessageTip(error && error.message)
        }
      }).finally(() => {
        this.$store.dispatch('CLOSE_LOADING')
      })
    },
    generateParams (pageSize, pageIndex) {
      return {
        ...this.formQuery,
        status: parseInt(this.switchActiveIndex),
        pageIndex,
        pageSize
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-btn {
  margin-left: 0 !important;
  margin-right: 0.8rem;
}
</style>
