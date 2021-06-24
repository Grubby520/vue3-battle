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
          content="说明：选择多个结算单可合并结算，确认结算将在请款单列表生成请款单(补扣款单会自动被选择,每次结算会把所有未结算的补扣款单一起结算)"
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
        @changeSelection="selectionChangeHandle"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="exportDetail(row)">导出</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>

<script>
import { exportFileFromRemote, date, thousandsSeparate, errorMessageTip } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsUrl from '@api/goods/goodsUrl'
import GoodsApi from '@api/goods'

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
          name: 'type',
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
          prop: 'settlementAmount',
          label: '结算金额(￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.settlementAmount)}</span>
          }
        },
        {
          prop: 'type',
          label: '结算单类型'
        },
        {
          prop: 'type',
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
      return this.tableData.filter(item => item.status !== 1).map(item => item.id)
    }
  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      GoodsApi.getSettlementOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.tableData = [
            {
              'id': 53,
              'settlementOrderNo': 'J20210311000010',
              'totalAmount': 40000,
              'settlementAmount': 40000,
              'supplierAmount': 40000,
              'freight': 0,
              'status': 1,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-16 17:47:06',
              'supplierConfirmAt': null,
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 0,
              'deductionAmount': 0,
              'createdAt': '2021-03-11 17:40:42',
              'settlementStartTime': '2021-03-03 23:59:59',
              'settlementEndTime': '2021-03-07 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': null,
              'paymentRequestNo': null,
              'statusName': '待商家确认',
              'clearingFormName': '周结'
            },
            {
              'id': 39,
              'settlementOrderNo': 'J20210310000027',
              'totalAmount': 4018,
              'settlementAmount': 4018,
              'supplierAmount': 4010,
              'freight': 8,
              'status': 4,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-10 17:09:16',
              'supplierConfirmAt': null,
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 0,
              'deductionAmount': 0,
              'createdAt': '2021-03-10 17:06:32',
              'settlementStartTime': '2021-02-22 00:00:00',
              'settlementEndTime': '2021-02-28 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': 7,
              'paymentRequestNo': 'P20210310000005',
              'statusName': '已结算',
              'clearingFormName': '周结'
            },
            {
              'id': 40,
              'settlementOrderNo': 'J20210310000028',
              'totalAmount': 10028,
              'settlementAmount': 10008,
              'supplierAmount': 10000,
              'freight': 8,
              'status': 1,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-11 09:38:36',
              'supplierConfirmAt': null,
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 20,
              'deductionAmount': 0,
              'createdAt': '2021-03-10 17:06:32',
              'settlementStartTime': '2021-02-15 00:00:00',
              'settlementEndTime': '2021-02-21 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': null,
              'paymentRequestNo': null,
              'statusName': '待商家确认',
              'clearingFormName': '周结'
            },
            {
              'id': 41,
              'settlementOrderNo': 'J20210310000029',
              'totalAmount': 30200,
              'settlementAmount': 30200,
              'supplierAmount': 30200,
              'freight': 0,
              'status': 4,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-10 17:35:50',
              'supplierConfirmAt': null,
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 0,
              'deductionAmount': 0,
              'createdAt': '2021-03-10 17:06:32',
              'settlementStartTime': '2021-02-08 23:59:59',
              'settlementEndTime': '2021-02-14 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': 9,
              'paymentRequestNo': 'P20210310000007',
              'statusName': '已结算',
              'clearingFormName': '周结'
            },
            {
              'id': 55,
              'settlementOrderNo': 'J20210311000009',
              'totalAmount': 39967,
              'settlementAmount': 40000,
              'supplierAmount': 40000,
              'freight': 0,
              'status': 4,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-11 18:25:44',
              'supplierConfirmAt': '2021-03-11 18:32:56',
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 0,
              'deductionAmount': 33,
              'createdAt': '2021-03-11 17:39:30',
              'settlementStartTime': '2021-03-02 23:59:59',
              'settlementEndTime': '2021-03-03 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': 21,
              'paymentRequestNo': 'P20210311000012',
              'statusName': '已结算',
              'clearingFormName': '周结'
            },
            {
              'id': 54,
              'settlementOrderNo': 'J20210311000008',
              'totalAmount': 188,
              'settlementAmount': 200,
              'supplierAmount': 200,
              'freight': 0,
              'status': 1,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-11 18:05:28',
              'supplierConfirmAt': '2021-03-11 18:05:37',
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 0,
              'deductionAmount': 12,
              'createdAt': '2021-03-11 17:38:16',
              'settlementStartTime': '2021-03-01 23:59:59',
              'settlementEndTime': '2021-03-02 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': null,
              'paymentRequestNo': null,
              'statusName': '待商家确认',
              'clearingFormName': '周结'
            },
            {
              'id': 46,
              'settlementOrderNo': 'J20210311000004',
              'totalAmount': 19950,
              'settlementAmount': 20000,
              'supplierAmount': 20000,
              'freight': 0,
              'status': 4,
              'paymentAt': null,
              'purchaseConfirmAt': '2021-03-11 15:40:25',
              'supplierConfirmAt': '2021-03-11 15:40:59',
              'supplierId': 17916,
              'supplierName': 'wlei测试供应商',
              'clearingForm': 2,
              'supplementaryAmount': 300,
              'deductionAmount': 350,
              'createdAt': '2021-03-11 15:03:00',
              'settlementStartTime': '2021-03-01 00:00:00',
              'settlementEndTime': '2021-03-01 23:59:59',
              'available': null,
              'lockAt': null,
              'paymentRequestId': 14,
              'paymentRequestNo': 'P20210311000005',
              'statusName': '已结算',
              'clearingFormName': '周结'
            }
          ]
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
        paymentAtStart: paymentAts && paymentAts[0] ? paymentAts[0] : '',
        paymentAtEnd: paymentAts && paymentAts[1] ? paymentAts[1] : ''
      }
    },
    // 确认请款
    confirmReimbursement () {
      this.loading = true
      GoodsApi.supplierConfirm(this.selections.map(item => {
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
        path: '/home/oem-finance-manage/settlement-order-detail',
        query: {
          settlementOrderId: String(row.id),
          settlementOrderNo: String(row.settlementOrderNo),
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
    },
    selectionChangeHandle (val) {
      this.$nextTick(() => {
        if (val.length > 0) {
          // 1、如果存在结算单类型的选中数据,则补扣款单行自动选中
          // 模拟交互逻辑
          let findOne = this.selections.some(row => row.id === 53) // 40
          if (findOne) {
            this.tableData.forEach(row => {
              if (row.id === 40) {
                this.$refs.table.toggleRowSelection(row, true)
              }
            })
          } else {
            // 2、如果没有结算单类型的选中数据,则取消所有补扣款单的选中
            this.tableData.forEach(row => {
              if (row.id === 40) {
                this.$refs.table.toggleRowSelection(row, false)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
