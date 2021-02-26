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
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        :selection="false"
        :operate="true"
        :tooltip="false"
      >
        <div slot="operation">
          <el-button type="text">查看附件</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>

<script>
import { thousandsSeparate } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsApi from '@api/goods'

export default {
  name: 'SupplyDeductMoneyList',
  data () {
    return {
      loading: false,
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'input',
          label: '补扣款单号',
          name: 'supplementaryDeductionNo'
        },
        {
          type: 'single-select',
          label: '款项类型',
          name: 'paymentType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
          }
        },
        {
          type: 'input',
          label: '源单编号',
          name: 'sourceOrderNo'
        },
        {
          type: 'single-select',
          label: '单据状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
          }
        }
      ],
      columns: [
        {
          prop: 'supplementaryDeductionNo',
          label: '补扣款单号'
        },
        {
          prop: 'paymentTypeName',
          label: '款项类型'
        },
        {
          prop: 'sourceOrderType',
          label: '源单类型'
        },
        {
          prop: 'sourceOrderNo',
          label: '源单编号'
        },
        {
          prop: 'supplementaryDeductionAmount',
          label: '总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplementaryDeductionAmount)
          }
        },
        {
          prop: 'status',
          label: '单据状态'
        },
        {
          prop: 'reimbursementId',
          label: '关联结算单'
        },
        {
          prop: 'createAt',
          label: '创建时间',
          width: '200'
        },
        {
          prop: 'reason',
          label: '驳回原因',
          width: '200'
        },
        {
          prop: 'operatorAt',
          label: '审核通过时间/驳回时间',
          width: '200'
        },
        {
          prop: 'remarks',
          label: '备注',
          width: '200'
        },
        {
          prop: 'attachmentNum',
          label: '附件数'
        }
      ]
    }
  },
  computed: {

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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
