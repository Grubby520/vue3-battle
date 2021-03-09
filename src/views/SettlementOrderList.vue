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
        >确认结算</el-button>&nbsp;&nbsp;
        <el-popover
          placement="top"
          title
          width="200"
          trigger="click"
          content="说明：选择多个结算单可合并结算，确认结算将在报账单列表生成报账单"
        >
          <span slot="reference" class="el-icon-info"></span>
        </el-popover>
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
import GoodsUrl from '@api/goods/goodsUrl'
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
          name: 'settlementOrderNo'
        },
        {
          type: 'input',
          label: '发货单号',
          name: 'deliveryNo'
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
            params: { dataCode: 'SETTLEMENT_ORDER_STATUS_ENUM' }
          }
        }
      ],
      columns: [
        {
          prop: 'settlementOrderNo',
          label: '结算单号',
          render: (h, data) => {
            let { row = {} } = data
            return row.settlementOrderNo ? <el-link type="primary" onClick={() => this.toDetail(row)}>{row.settlementOrderNo}</el-link> : ''
          }
        },
        {
          prop: 'totalAmount',
          label: '总金额(￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.totalAmount)}</span>
          }
        },
        {
          prop: 'settlementAmount',
          label: '结算金额(￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.settlementAmount)}</span>
          }
        },
        {
          prop: 'supplementaryAmount',
          label: '补款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.supplementaryAmount)}</span>
          }
        },
        {
          prop: 'deductionAmount',
          label: '扣款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.deductionAmount)}</span>
          }
        },
        {
          prop: 'statusName',
          label: '状态'
        },
        {
          prop: 'paymentRequestNo',
          label: '关联报账单号'
        },
        {
          prop: 'paymentAt',
          label: '账期时间',
          width: '150'
        },
        {
          prop: 'supplierConfirmAt',
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
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getSettlementOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.disabledKeys = data.list.filter(item => item.status !== 1).map(item => item.id)
        }
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
      let { paymentAts = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        paymentAtStart: paymentAts && paymentAts[0] ? paymentAts[0] : '',
        paymentAtEnd: paymentAts && paymentAts[1] ? paymentAts[1] : ''
      }
    },
    // 确认报账
    confirmReimbursement () {
      this.loading = true
      GoodsApi.supplierConfirm(this.selections.map(item => {
        return {
          settlementOrderId: item.id
        }
      })
      ).then(res => {
        if (res.success) {
          this.$message.success(`已生成报账单${res.data ? res.data : ''},请前往报账单列表上传对应报账单资料`)
          this.selections = []
          this.gotoPage()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toDetail (row) {
      this.$router.push({
        path: '/home/finance/settlement-order-detail',
        query: {
          settlementOrderNo: row.settlementOrderNo,
          deliveryNo: row.deliveryNo
        }
      })
    },
    exportDetail (row) {
      exportFileFromRemote({
        url: GoodsUrl.exportSettlement,
        name: `结算单${row.settlementOrderNo}详情_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`,
        params: { settlementOrderId: row.id, type: 1 },
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
