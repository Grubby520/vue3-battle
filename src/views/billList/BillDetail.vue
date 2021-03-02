<template>
  <div>
    <p class="border-bottom mb-2rem">
      <el-button type="text" size="medium" @click="goBack">返回</el-button>
      <el-divider direction="vertical"></el-divider>
      <span v-if="reimbursementNo">
        付款单号：
        <b class="color-text--gray-mid">{{reimbursementNo}}</b>
      </span>
    </p>
    <SlPanel title="报账单信息">
      <div class="grid">
        <div>
          <span>供应商编号:</span>
          <span>{{paymentInfo.supplierId}}</span>
        </div>
        <div>
          <span>供应商名称:</span>
          <span>{{paymentInfo.supplierName}}</span>
        </div>
        <div>
          <span>结算方式:</span>
          <span>{{paymentInfo.clearingForm | parseClearingForm}}</span>
        </div>
        <div>
          <span>报账单号:</span>
          <span>{{paymentInfo.reimbursementNo}}</span>
        </div>
        <div>
          <span>报账单状态:</span>
          <span>{{paymentInfo.status | parseStatus}}</span>
        </div>
        <div>
          <span>创建时间:</span>
          <span>{{paymentInfo.requestPayoutAt}}</span>
        </div>
        <div>
          <span>币种:</span>
          <span>{{paymentInfo.currency}}</span>
        </div>
        <div>
          <span>附件数量:</span>
          <!-- TODO: 链接 -->
          <el-link>{{paymentInfo.attachmentNum}}</el-link>
        </div>
        <div>
          <span>申请报账总金额:</span>
          <span>{{paymentInfo.applyReimbursementAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>结算总金额:</span>
          <span>{{paymentInfo.settlementAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>补款总金额:</span>
          <span>{{paymentInfo.supplyMoneyAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>扣款总金额:</span>
          <span>{{paymentInfo.deductMoneyAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>已付总金额:</span>
          <span>{{paymentInfo.paidAmount | numFormat('thousandsSeparate')}}</span>
        </div>
      </div>
    </SlPanel>
    <SlPanel title="财务信息">
      <div class="grid">
        <div>
          <span>开户名:</span>
          <span>{{financeInfo.payeeName}}</span>
        </div>
        <div>
          <span>银行账号:</span>
          <span>{{financeInfo.payeeAccount}}</span>
        </div>
        <div>
          <span>开户银行:</span>
          <span>{{financeInfo.payeeBank}}</span>
        </div>
        <div>
          <span>开户支行:</span>
          <span>{{financeInfo.payeeBankBranch}}</span>
        </div>
        <div>
          <span>联系电话:</span>
          <span>{{financeInfo.phoneNumber}}</span>
        </div>
      </div>
    </SlPanel>
    <SlPanel title="结算单信息">
      <SlListView
        @gotoPage="fetchSettlementOrder"
        :total="settlementOrder.page.total"
        :pageIndex="settlementOrder.page.pageIndex"
        :pageSize="settlementOrder.page.pageSize"
      >
        <SlTable
          :tableData="settlementOrder.list"
          :columns="settlementOrderColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
        ></SlTable>
      </SlListView>
    </SlPanel>
    <SlPanel title="补扣款单信息">
      <SlListView
        @gotoPage="fetchSupplementaryDeduction"
        :total="supplementaryDeduction.page.total"
        :pageIndex="supplementaryDeduction.page.pageIndex"
        :pageSize="supplementaryDeduction.page.pageSize"
      >
        <SlTable
          :tableData="supplementaryDeduction.list"
          :columns="supplementaryDeductionColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
        ></SlTable>
      </SlListView>
    </SlPanel>
  </div>
</template>

<script>
import GOODS_API from '@api/goods'
import { thousandsSeparate } from '@shared/util'
const pageCfg = Object.freeze({ index: 1, size: 10 })
const settlementOrderColumns = [
  {
    prop: 'deliveryNo',
    label: '发货单号',
    render: (h, data) => {
      const { row = {} } = data
      return <el-link type="primary" onClick={() => this.toDetail(row)}>{row.reimbursementNo}00000</el-link>
    }
  },
  {
    prop: 'settlementOrderNo',
    label: '结算单号',
    render: (h, data) => {
      const { row = {} } = data
      return <el-link type="primary" onClick={() => this.toDetail(row)}>{row.reimbursementNo}00000</el-link>
    }
  },
  {
    prop: 'settlementAmount',
    label: '结算金额(¥)',
    render: (h, data) => {
      const { row = {} } = data
      return thousandsSeparate(row.settlementAmount)
    }
  },
  {
    prop: 'supplierAmount',
    label: '供货金额(¥)',
    render: (h, data) => {
      const { row = {} } = data
      return thousandsSeparate(row.supplierAmount)
    }
  },
  {
    prop: 'freightSubsidy',
    label: '运费补贴(¥)',
    render: (h, data) => {
      const { row = {} } = data
      return thousandsSeparate(row.reimbursementNo)
    }
  },
  {
    prop: 'supplierTotal',
    label: '供货数量'
  },
  {
    prop: 'status',
    label: '结算单状态',
    render: (h, data) => {
      const { row = {} } = data
      const enums = ['待采购确认', '待商家确认', '已确认', '待结算', '结算中', '已结算', '结算失败']
      return enums[row.status]
    }
  },
  {
    prop: 'paymentAt',
    label: '账期时间'
  },
  {
    prop: 'confirmAt',
    label: '确认时间'
  }
]

const supplementaryDeductionColumns = [
  {
    prop: 'supplementaryDeductionNo',
    label: '补扣款单号'
  },
  {
    prop: 'paymentType',
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
    label: '总金额(¥)',
    render: (h, data) => {
      const { row = {} } = data
      return thousandsSeparate(row.sesupplementaryDeductionAmount)
    }
  },
  {
    prop: 'remarks',
    label: '备注'
  },
  {
    prop: 'confirmAt',
    label: '确认时间'
  }
]

export default {
  filters: {
    parseClearingForm: function (value) {
      const enums = ['网商100%预付', '货到付款', '周结', '半月结', '月结', '预付转账', '阿里账期', '档口现付']
      return enums[value]
    },
    parseStatus: function (value) {
      const enums = Object.freeze({
        '-1': '待上传合同',
        0: '审核中',
        1: '审核驳回',
        2: '审核通过'
      })
      return enums[value]
    }
  },
  data () {
    const { reimbursementNo } = this.$route.query
    return {
      reimbursementNo,
      paymentInfo: {},
      financeInfo: {},
      settlementOrder: {
        list: [],
        page: {},
        loading: false
      },
      supplementaryDeduction: {
        list: [],
        page: {},
        loading: false
      },
      settlementOrderColumns,
      supplementaryDeductionColumns
    }
  },
  async mounted () {
  },
  methods: {
    fetchPaymentInfo () {
      GOODS_API.getPaymentInfo({ reimbursementNo: this.reimbursementNo }).then(({ success, data }) => {
        if (success) this.paymentInfo = data
      })
    },
    fetchFinanceInfo () {
      GOODS_API.getFinanceInfo({ paymentRequestId: this.reimbursementNo }).then(({ success, data }) => {
        if (success) this.financeInfo = data
      })
    },
    fetchSettlementOrder (pageSize = pageCfg.size, pageIndex = pageCfg.index) {
      this.$set(this.settlementOrder, 'loading', true)
      GOODS_API.getSettlementOrder({ reimbursementNo: this.reimbursementNo, pageIndex, pageSize }).then(({ success, data }) => {
        if (success) {
          const { list, total } = data
          this.settlementOrder = {
            list,
            page: {
              total,
              pageIndex,
              pageSize,
              loading: false
            }
          }
        }
      }).finally(() => {
        this.$set(this.settlementOrder, 'loading', false)
      })
    },
    fetchSupplementaryDeduction (pageSize = pageCfg.size, pageIndex = pageCfg.index) {
      this.$set(this.supplementaryDeduction, 'loading', true)
      GOODS_API.getSupplementaryDeduction({ reimbursementNo: this.reimbursementNo, pageIndex, pageSize }).then(({ success, data }) => {
        if (success) {
          const { list, total } = data
          this.supplementaryDeduction = {
            list,
            page: {
              total,
              pageIndex,
              pageSize,
              loading: false
            }
          }
        }
      }).finally(() => {
        this.$set(this.supplementaryDeduction, 'loading', false)
      })
    },
    goBack () {
      this.$router.push({
        path: localStorage.getItem('activePath')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 30px;
}
</style>
