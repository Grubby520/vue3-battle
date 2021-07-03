<template>
  <div>
    <div class="mb-8px">
      <el-button type="text" size="medium" style="padding:0" @click="goBack">返回</el-button>
      <el-divider direction="vertical"></el-divider>
      <template v-if="paymentRequestId">
        <span class="color-text--primary mr-8px">请款单号:</span>
        <span class="color-text--minor">{{paymentDetail.paymentRequestNo}}</span>
      </template>
    </div>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="请款单信息"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <el-row>
        <el-col :span="4" v-for="prop in paymentInfoProps" :key="prop.value">
          <div style="line-height:2">
            <span class="color-text--primary mr-8px">{{prop.label}}:</span>
            <span
              v-if="prop.value !== 'attachmentNum'"
              class="color-text--minor"
            >{{prop.format?prop.format(paymentDetail[prop.value]):paymentDetail[prop.value]}}</span>
            <template v-else>
              <el-link
                v-if="paymentDetail[prop.value] > 0"
                type="primary"
                style="vertical-align:baseline"
                @click="openAttachmentsManageDialog"
              >{{paymentDetail[prop.value]}}</el-link>
              <span v-else>0</span>
            </template>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="财务信息"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <el-row>
        <el-col :span="4" v-for="prop in financeInfoProps" :key="prop.value">
          <div style="line-height:2">
            <span class="color-text--primary mr-8px">{{prop.label}}:</span>
            <span class="color-text--minor">{{financeInfo[prop.value]}}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="结算单信息"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlListView
        @gotoPage="fetchSettlementOrder"
        :total="settlementOrder.page.total"
        :pageIndex="settlementOrder.page.pageIndex"
        :pageSize="settlementOrder.page.pageSize"
      >
        <SlTable
          maxHeight="400px"
          align="left"
          :tableData="settlementOrder.list"
          :columns="settlementOrderColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
          :isEmbedTable="true"
          :loading="settlementOrder.loading"
        ></SlTable>
      </SlListView>
    </el-card>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="补扣款单信息"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlListView
        @gotoPage="fetchSupplementaryDeduction"
        :total="supplementaryDeduction.page.total"
        :pageIndex="supplementaryDeduction.page.pageIndex"
        :pageSize="supplementaryDeduction.page.pageSize"
      >
        <SlTable
          maxHeight="400px"
          align="left"
          :tableData="supplementaryDeduction.list"
          :columns="supplementaryDeductionColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
          :isEmbedTable="true"
          :loading="supplementaryDeduction.loading"
        ></SlTable>
      </SlListView>
    </el-card>
    <AttachmentsManageDialog
      title="查看附件"
      :show.sync="attachmentsManageDialogShow"
      :data.sync="attachments"
      :status="attachmentsManageStatus"
      :fileType="3"
      data-key="associationId"
    ></AttachmentsManageDialog>
  </div>
</template>

<script>
import GOODS_API from '@api/goods'
import SettlementApi from '@api/settlement'
import { thousandsSeparate } from '@shared/util'
import AttachmentsManageDialog from '@/views/components/AttachmentsManageDialog.vue'
const pageCfg = Object.freeze({ index: 1, size: 10 })

export default {
  components: {
    AttachmentsManageDialog
  },
  data () {
    return {
      titleFontSize: '1.4rem',
      titleStyle: { marginBottom: '0px', display: 'inline-block' },
      paymentRequestId: this.$route.query.paymentRequestId,
      status: this.$route.query.status,
      paymentDetail: {},
      paymentInfoProps: [
        {
          label: '供应商编号',
          value: 'supplierId'
        },
        {
          label: '供应商名称',
          value: 'supplierName'
        },
        {
          label: '结算方式',
          value: 'clearingFormName'
        },
        {
          label: '请款单号',
          value: 'paymentRequestNo'
        },
        {
          label: '请款单状态',
          value: 'statusName'
        },
        {
          label: '创建时间',
          value: 'requestPayoutAt'
        },
        {
          label: '币种',
          value: 'currencyName'
        },
        {
          label: '附件数量',
          value: 'attachmentNum'
        },
        {
          label: '请款总金额',
          value: 'applyPaymentAmount',
          format: thousandsSeparate
        },
        {
          label: '结算总金额',
          value: 'settlementAmount',
          format: thousandsSeparate
        },
        {
          label: '补款总金额',
          value: 'supplyMoneyAmount',
          format: thousandsSeparate
        },
        {
          label: '扣款总金额',
          value: 'deductMoneyAmount',
          format: thousandsSeparate
        },
        {
          label: '已付总金额',
          value: 'paidAmount',
          format: thousandsSeparate
        }
      ],
      financeInfoProps: [
        {
          label: '开户名',
          value: 'payeeName'
        },
        {
          label: '银行账号',
          value: 'payeeAccount'
        },
        {
          label: '开户银行',
          value: 'payeeBank'
        },
        {
          label: '开户支行',
          value: 'payeeBankBranch'
        },
        {
          label: '收款人身份证号',
          value: 'payeeIdCard'
        },
        {
          label: '联系电话',
          value: 'phoneNumber'
        }
      ],
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
      settlementOrderColumns: [
        {
          prop: 'deliveryNo',
          label: '发货单号',
          render: (h, data) => {
            const { row = {} } = data
            if (+this.status === 1) {
              return <span>{row.deliveryNo}</span>
            } else {
              return <el-link type="primary" onClick={() => this.toDetail(row, 1)}>{row.deliveryNo}</el-link>
            }
          }
        },
        {
          prop: 'settlementOrderNo',
          label: '结算单号',
          render: (h, data) => {
            const { row = {} } = data
            if (+this.status === 1) {
              return <span>{row.settlementOrderNo}</span>
            } else {
              return <el-link type="primary" onClick={() => this.toDetail(row, 2)}>{row.settlementOrderNo}</el-link>
            }
          }
        },
        {
          prop: 'settlementAmount',
          label: '结算金额(¥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.settlementAmount)}</span>
          }
        },
        {
          prop: 'supplierAmount',
          label: '供货金额(¥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.supplierAmount)}</span>
          }
        },
        {
          prop: 'freightSubsidy',
          label: '运费补贴(¥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.freightSubsidy)}</span>
          }
        },
        {
          prop: 'supplierTotal',
          label: '供货数量'
        },
        {
          prop: 'statusName',
          label: '结算单状态'
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
          prop: 'paymentTypeName',
          label: '款项类型'
        },
        {
          prop: 'sourceOrderTypeName',
          label: '源单类型'
        },
        {
          prop: 'sourceOrderNo',
          label: '源单编号'
        },
        {
          label: '总金额(¥)',
          render: (h, data) => {
            const { row = {} } = data
            const amount = row.paymentType === 1 ? -row.supplementaryDeductionAmount : row.supplementaryDeductionAmount
            return <span>{thousandsSeparate(amount)}</span>
          }
        },
        {
          prop: 'remarks',
          label: '备注',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:200px">{row.remarks}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.remarks}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'confirmAt',
          label: '创建时间'
        }
      ],
      attachmentsManageDialogShow: false,
      attachmentsManageStatus: 'view',
      attachments: []
    }
  },
  computed: {
    financeInfo () {
      return this.paymentDetail.financeInfoVo || {}
    }
  },
  async mounted () {
    this.getPaymentDetail()
  },
  methods: {
    getPaymentDetail () {
      SettlementApi.getPaymentOrderDetail(this.paymentRequestId).then(({ success, data }) => {
        if (success) {
          this.paymentDetail = data
        }
      })
    },
    fetchSettlementOrder (pageSize = pageCfg.size, pageIndex = pageCfg.index) {
      this.$set(this.settlementOrder, 'loading', true)
      SettlementApi.getSettlementOrderInfo({ paymentRequestId: this.paymentRequestId, pageIndex, pageSize }).then(({ success, data }) => {
        if (success) {
          const { list, total } = data
          this.settlementOrder = {
            list,
            page: {
              total,
              pageIndex,
              pageSize
            }
          }
        }
      }).finally(() => {
        this.$set(this.settlementOrder, 'loading', false)
      })
    },
    fetchSupplementaryDeduction (pageSize = pageCfg.size, pageIndex = pageCfg.index) {
      this.$set(this.supplementaryDeduction, 'loading', true)
      SettlementApi.getSupplementaryDeductionInfo({ paymentRequestId: this.paymentRequestId, pageIndex, pageSize }).then(({ success, data }) => {
        if (success) {
          const { list, total } = data
          this.supplementaryDeduction = {
            list,
            page: {
              total,
              pageIndex,
              pageSize
            }
          }
        }
      }).finally(() => {
        this.$set(this.supplementaryDeduction, 'loading', false)
      })
    },
    fetchAttachmentList () {
      GOODS_API.getAttachmentList({ associationId: this.paymentRequestId, associationType: '3' }).then(({ success, data }) => {
        if (success) {
          this.attachments = data.map(({ associationId, ...item }) => {
            return {
              associationId,
              name: item.attachmentName,
              src: item.attachmentUrl
            }
          })
        }
      })
    },
    toDetail ({ settlementOrderId, settlementOrderNo, deliveryNo }, type) {
      let query = {
        settlementOrderId,
        settlementOrderNo
      }
      if (type === 1) {
        query.deliveryNo = deliveryNo
      }
      this.$router.push({
        path: '/home/finance/settlement-order-detail',
        query
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    openAttachmentsManageDialog () {
      this.fetchAttachmentList()
      this.attachmentsManageDialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
