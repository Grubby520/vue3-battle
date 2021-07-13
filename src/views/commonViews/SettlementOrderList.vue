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
          v-model="query"
          :items="searchItems"
          :loading="tableLoading"
          @reset="gotoPage(page.pageSize)"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>
      </div>
      <SlTableToolbar>
        <SlButton
          type="primary"
          boxShadow="primary"
          :loading="loading"
          :disabled="!canConfirm"
          @click="confirmReimbursement"
        >确认结算</SlButton>&nbsp;
        <el-popover
          placement="top"
          title
          width="250"
          trigger="click"
          content="说明：选择多个结算单可合并结算，确认结算将在请款单列表生成请款单(补扣款单不能单独确认,会随结算单的选择自动被选择,每次结算会把所有未结算的补扣款单一起结算)"
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
        align="left"
        @changeSelection="selectionChangeHandle"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button v-if="row.orderType !== 1" type="text" @click="exportDetail(row)">导出</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>

<script>
import { exportFileFromRemote, date, thousandsSeparate, errorMessageTip, getSessionItem } from '@shared/util'
import CommonUrl from '@api/url.js'
import SettlementUrl from '@api/settlement/settlementUrl'
import SettlementApi from '@api/settlement'

export default {
  name: 'SettlementOrderList',
  data () {
    return {
      tableLoading: false,
      loading: false,
      tableData: [],
      selections: [],
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
        },
        {
          type: 'single-select',
          label: '结算单类型',
          name: 'orderType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'SETTLEMENT_ORDER_TYPE_ENUM' }
          }
        }
      ],
      columns: [
        {
          prop: 'settlementOrderNo',
          label: '结算单号',
          render: (h, data) => {
            let { row = {} } = data
            if (row.orderType === 1) { // 补扣款单不能访问到详情
              return <span>{row.settlementOrderNo}</span>
            }
            return row.settlementOrderNo ? <el-link type="primary" onClick={() => this.toDetail(row)}>{row.settlementOrderNo}</el-link> : ''
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
          prop: 'orderTypeName',
          label: '结算单类型'
        },
        {
          prop: 'paymentTypeName',
          label: '款项类型'
        },
        {
          prop: 'statusName',
          label: '状态'
        },
        {
          prop: 'paymentRequestNo',
          label: '关联请款单号'
        },
        {
          prop: 'createdAt',
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
    },
    disabledKeys () {
      // 非待商家确认状态不可选、补扣款单类型单据不能单独选中
      return this.tableData.filter(item => item.status !== 1 || item.orderType === 1).map(item => item.id)
    }
  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      SettlementApi.getSettlementOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    generateParams (pageSize, pageIndex) {
      let { paymentAts = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        businessType: getSessionItem('supplierType') === 'OEM' ? 1 : 0,
        createdAtStart: paymentAts && paymentAts[0] ? paymentAts[0] : '',
        createdAtEnd: paymentAts && paymentAts[1] ? paymentAts[1] : ''
      }
    },
    // 确认请款
    confirmReimbursement () {
      this.loading = true
      let settlementOrders = this.selections.filter(item => item.orderType === 0) // 只取结算单
      SettlementApi.supplierConfirm(settlementOrders.map(item => {
        return {
          settlementOrderId: item.id
        }
      })
      ).then(res => {
        if (res.success) {
          this.$message.success(`已生成请款单${res.data ? res.data : ''},请前往请款单列表上传对应请款单资料`)
          this.selections = []
          this.gotoPage()
        } else {
          errorMessageTip(res.error && res.error.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toDetail (row) {
      this.$router.push({
        path: '/home/finance/settlement-order-detail',
        query: {
          settlementOrderId: String(row.id),
          settlementOrderNo: String(row.settlementOrderNo),
          deliveryNo: row.deliveryNo
        }
      })
    },
    exportDetail (row) {
      exportFileFromRemote({
        url: SettlementUrl.exportSettlement,
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
    },
    selectionChangeHandle (val) {
      this.$nextTick(() => {
        if (val.length > 0) {
          // 1、如果存在选中的结算单,则自动选中所有【待商家确认状态】的补扣款单
          let findSettlementOrder = this.selections.some(row => row.orderType === 0)
          if (findSettlementOrder) {
            this.tableData.forEach(row => {
              let hasSelected = this.selections.find(item => item.id === row.id)
              if (row.orderType === 1 && row.status === 1 && !hasSelected) { // 判断是否是未选中的、待商家确认状态的补扣款单
                this.$refs.table.toggleRowSelection(row, true)
              }
            })
          } else {
            // 2、如果没有选中的结算单,则取消选中所有补扣款单
            this.$refs.table.clearSelection()
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
