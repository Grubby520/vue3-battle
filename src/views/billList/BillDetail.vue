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
          <span>{{currency}}</span>
        </div>
        <div>
          <span>附件数量:</span>
          <!-- TODO: 链接 -->
          <el-link>{{attachmentNum}}</el-link>
        </div>
        <div>
          <span>申请报账总金额:</span>
          <span>{{applyReimbursementAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>结算总金额:</span>
          <span>{{settlementAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>补款总金额:</span>
          <span>{{supplyMoneyAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>扣款总金额:</span>
          <span>{{deductMoneyAmount | numFormat('thousandsSeparate')}}</span>
        </div>
        <div>
          <span>已付总金额:</span>
          <span>{{paidAmount | numFormat('thousandsSeparate')}}</span>
        </div>
      </div>
    </SlPanel>
    <SlPanel title="财务信息">
      <div class="grid">
        <div>
          <span>开户名:</span>
        </div>
        <div>
          <span>银行账号:</span>
        </div>
        <div>
          <span>开户银行:</span>
        </div>
        <div>
          <span>开户支行:</span>
        </div>
        <div>
          <span>联系电话:</span>
        </div>
      </div>
    </SlPanel>
    <SlPanel title="结算单信息">
      <SlTable
        :tableData="settlementOrder.list"
        :columns="settlementOrderColumns"
        :selection="false"
        :operate="false"
        :tooltip="false"
      ></SlTable>
    </SlPanel>
    <SlPanel title="补扣款单信息">
      <SlTable
        :tableData="supplementaryDeduction.list"
        :columns="supplementaryDeductionColumns"
        :selection="false"
        :operate="false"
        :tooltip="false"
      ></SlTable>
    </SlPanel>
  </div>
</template>

<script>
import GOODS_API from '@api/goods'
import { thousandsSeparate } from '@shared/util'

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
  propsData () {
    return {
    }
  },
  data () {
    const { reimbursementNo } = this.$route.query
    return {
      reimbursementNo,
      paymentInfo: {},
      settlementOrder: {
        list: []
      },
      supplementaryDeduction: {
        list: []
      },
      settlementOrderColumns: [
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
      ],

      supplementaryDeductionColumns: [
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
          prop: '',
          label: '源单编号'
        },
        {
          label: '总金额(¥)'
        },
        {
          label: '备注'
        },
        {
          label: '确认时间'
        }
      ]
    }
  },
  async mounted () {
    (await Promise.all([
      GOODS_API.getPaymentInfo(this.reimbursementNo),
      GOODS_API.getSettlementOrderInfo(this.reimbursementNo),
      GOODS_API.getSupplementaryDeductionInfo(this.reimbursementNo)
    ])).forEach(({ success, data }, index) => {
      if (!success) return
      switch (index) {
        case 0:
          this.paymentInfo = data
          break
        case 1:
          this.settlementOrder = data
          break
        case 2:
          this.supplementaryDeduction = data
          break
      }
    })
  },
  methods: {
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
