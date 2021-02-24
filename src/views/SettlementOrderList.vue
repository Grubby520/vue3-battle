<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button
          type="primary"
          @click="confirmReimbursement"
          :loading="loading"
          :disabled="!canConfirm"
        >确认并报账</el-button>
      </SlTableToolbar>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        v-model="selections"
        :tableData="tableData"
        :columns="columns"
        :disabledKeys="disabledKeys"
        :selection="true"
        :operate="true"
        :tooltip="false"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="exportDetail(row)">导出</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>

<script>
import { exportFileFromRemote, date, thousandsSeparate } from '@shared/util'
import CommonUrl from '@api/url.js'
import SettlementOrderUrl from '@api/settlementOrder/settlementOrderUrl.js'
import GoodsApi from '@api/goods'

export default {
  name: 'SettlementOrderList',
  data () {
    return {
      loading: false,
      tableData: [],
      selections: [],
      disabledKeys: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'input',
          label: '结算单号',
          name: 'settlementNo'
        },
        {
          type: 'input',
          label: '发货单号',
          name: 'deliveryOrderNo'
        },
        {
          type: 'date',
          label: '账期时间',
          name: 'paymentAts',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        },
        {
          type: 'single-select',
          label: '状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
          }
        }
      ],
      columns: [
        {
          prop: 'settlementOrderNo',
          label: '结算单号',
          render: (h, data) => {
            let { row = {} } = data
            return <el-link type="primary" onClick={() => this.toDetail(row)}>{row.settlementOrderNo}00000</el-link>
          }
        },
        {
          prop: 'settlementAmount',
          label: '结算金额(￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.settlementAmount)
          }

        },
        {
          prop: 'supplierAmount',
          label: '供货金额(￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplierAmount)
          }
        },
        {
          prop: 'freight',
          label: '运费(￥)',
          width: '80',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.freight)
          }
        },
        {
          prop: 'supplyMoneyAmount',
          label: '补款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplyMoneyAmount)
          }
        },
        {
          prop: 'deductMoneyAmount',
          label: '扣款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.deductMoneyAmount)
          }
        },
        {
          prop: 'status',
          label: '状态'
        },
        {
          prop: 'reimbursementNo',
          label: '关联报账单号'
        },
        {
          prop: 'paymentAt',
          label: '账期时间',
          width: '150'
        },
        {
          prop: 'confirmAt',
          label: '确认时间',
          width: '150'
        }
      ]
    }
  },
  computed: {
    canConfirm () {
      return this.selections.length > 0
    }
  },
  mounted () {

  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getPurchaseTableList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
        }
        this.disabledKeys = [226, 227]
      }).finally(() => {
        this.$refs.listView.loading = false
      })
    },
    reset () {
      this.resetParams()
      this.$refs.listView.refresh()
    },
    resetParams () {
      this.$refs.searchForm.reset()
    },
    generateParams (pageSize, pageIndex) {
      // let { paymentAts = [], ...orther } = this.query
      let { cTimes = [], uTimes = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        cStartTime: cTimes && cTimes[0] ? cTimes[0] : '',
        cEndTime: cTimes && cTimes[1] ? cTimes[1] : '',
        uStartTime: uTimes && uTimes[0] ? uTimes[0] : '',
        uEndTime: uTimes && uTimes[1] ? uTimes[1] : ''
      }
    },
    // 确认报账
    confirmReimbursement () {
      this.loading = true
      this.$message.success(`已生成报账单XXXXXX,请前往报账单列表上传对应报账单资料`)
      this.loading = false
    },
    toDetail (row) {
      this.$router.push({
        path: '/home/finance/settlement-order-detail',
        query: {
          settlementOrderId: '123456789'
        }
      })
    },
    exportDetail (row) {
      exportFileFromRemote({
        url: SettlementOrderUrl.exportDetailUrl,
        name: `结算单${row.settlementOrderNo}详情_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`,
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
        },
        afterLoad: () => {
          this.loading = false
          this.selections = []
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
