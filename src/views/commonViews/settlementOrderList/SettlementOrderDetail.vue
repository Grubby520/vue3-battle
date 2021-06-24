<template>
  <div v-loading="loading">
    <div class="mb-8px">
      <el-button
        class="mr-8px"
        type="text"
        size="medium"
        @click="$router.go(-1)"
        style="padding:0"
      >返回</el-button>
      <span class="color-text--primary mr-8px">结算单号:</span>
      <span class="color-text--minor">123456789</span>
    </div>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="发货单结算信息"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlTable
        ref="deliverySettleList"
        align="left"
        :selection="false"
        :border="false"
        :tableData="deliverySettleList"
        :columns="deliverySettleColumns"
        :operate="false"
        :tooltip="false"
        :isEmbedTable="true"
        :showSummary="true"
        :summaryMethod="deliverySummaryMethod"
        maxHeight="400px"
        rowKey="id"
      ></SlTable>
    </el-card>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="供货明细"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlListView
        ref="listView"
        @gotoPage="getSupplyList"
        :total="supplyPage.total"
        :pageIndex="supplyPage.pageIndex"
        :pageSize="supplyPage.pageSize"
      >
        <SlTable
          ref="supplyList"
          maxHeight="400px"
          :tableData="supplyList"
          :columns="supplyListColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
          :isEmbedTable="true"
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
      <SlTable
        ref="supplementaryDeductionList"
        align="left"
        maxHeight="400px"
        :selection="false"
        :border="false"
        :tableData="supplementaryDeductionList"
        :columns="supplementaryDeductionColumns"
        :operate="false"
        :tooltip="false"
        :isEmbedTable="true"
        :showSummary="true"
        :summaryMethod="supDeductionSummaryMethod"
        rowKey="id"
      ></SlTable>
    </el-card>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { thousandsSeparate } from '@shared/util'
import GoodsApi from '@api/goods'

export default {
  name: 'SettlementOrderDetail',
  props: {},
  data () {
    return {
      loading: false,
      titleFontSize: '1.4rem',
      titleStyle: { marginBottom: '0px', display: 'inline-block' },
      deliveryNo: this.$route.query.deliveryNo,
      settlementOrderId: this.$route.query.settlementOrderId,
      settlementOrderNo: this.$route.query.settlementOrderNo,
      detailItems: [
        {
          label: '结算单号',
          value: 'settlementOrderNo'
        }
      ],
      deliverySettleList: [],
      deliverySettleColumns: [
        {
          prop: 'deliveryNo',
          label: '发货单号',
          width: '200'
        },
        {
          prop: 'settlementOrderNo',
          label: '结算单号',
          width: '200'
        },
        {
          prop: 'settlementAmount',
          label: '结算金额 (￥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.settlementAmount)}</span>
          }
        },
        {
          prop: 'supplierAmount',
          label: '供货金额 (￥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.supplierAmount)}</span>
          }
        },
        {
          prop: 'supplierTotal',
          label: '供货数量'
        },
        {
          prop: 'freightSubsidy',
          label: '运费补贴 (￥)',
          render: (h, data) => {
            const { row = {} } = data
            return <span>{thousandsSeparate(row.freightSubsidy)}</span>
          }
        },
        {
          prop: 'createdAt',
          label: '账期时间',
          width: '200'
        }
      ],
      supplyPage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      supplyList: [],
      supplyListColumns: [
        {
          prop: 'purchaseOrderNumber',
          label: '采购订单号',
          width: '150'
        },
        {
          prop: 'deliveryNo',
          label: '发货单号',
          width: '150'
        },
        {
          prop: 'skuCode',
          label: 'SKU',
          width: '120'
        },
        {
          prop: 'supplierSkuCode',
          label: '商家SKU',
          width: '80'
        },
        {
          prop: 'supplierItemNumber',
          label: '供方货号',
          width: '120'
        },
        {
          prop: 'productName',
          label: '商品名称',
          width: '120'
        },
        {
          prop: 'attributesName',
          label: '销售属性',
          width: '120'
        },
        {
          prop: 'orderRequireNum',
          label: '下单数量'
        },
        {
          prop: 'deliveryNum',
          label: '发货数量'
        },
        {
          prop: 'shelvedNum',
          label: '上架量'
        },
        {
          prop: 'supplierPrice',
          label: '供货单价',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.supplierPrice)}</span>
          }
        },
        {
          prop: 'supplierTotalAmount',
          label: '供货总金额',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.supplierTotalAmount)}</span>
          }
        }
      ],
      supplementaryDeductionList: [],
      supplementaryDeductionColumns: [
        {
          prop: 'supplementaryDeductionNo',
          label: '补扣款单号',
          width: '200'
        },
        {
          prop: 'paymentTypeName',
          label: '款项类型',
          width: '200'
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
          prop: 'amount',
          label: '总金额 (￥)',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.amount)}</span>
          }
        },
        {
          prop: 'remarks',
          label: '备注',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top-start" effect="light">
                <div slot="content" style="max-width:200px;">{row.remarks}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.remarks}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'confirmAt',
          label: '确认时间',
          width: '200'
        }
      ]
    }
  },
  computed: {

  },
  watch: {},
  created () {
    this.getDetailInfo()
  },
  methods: {
    getDetailInfo () {
      this.getDeliverySettleInfo()
      this.getSupplyList()
      this.getSupplementaryDeductionList()
    },
    getDeliverySettleInfo () {
      if (!this.deliveryNo && !this.settlementOrderId) {
        return
      }
      this.loading = true
      GoodsApi.getDeliveryInfo({
        deliveryNo: this.deliveryNo,
        settlementOrderId: this.settlementOrderId
      }).then(res => {
        if (res.success) {
          this.deliverySettleList = res.data || []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    deliverySummaryMethod (param) {
      const { columns, data } = param
      const sums = []
      const sumProperties = ['settlementAmount', 'supplierAmount', 'supplierTotal', 'freightSubsidy']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        if (sumProperties.indexOf(column.property) !== -1) {
          let total = 0
          data.forEach(item => {
            let value = Number(item[column.property])
            if (!isNaN(value)) {
              total = BigNumber(value).plus(total)
            }
          })
          sums[index] = thousandsSeparate(total)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    getSupplyList (pageSize = 10, pageIndex = 1) {
      GoodsApi.getSupplyDetails({
        deliveryNo: this.deliveryNo,
        settlementOrderId: this.settlementOrderId,
        pageIndex,
        pageSize
      }).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.supplyList = data.list
          this.supplyPage.total = data.total
          this.supplyPage.pageIndex = pageIndex
          this.supplyPage.pageSize = pageSize
        }
      }).finally(() => { })
    },
    getSupplementaryDeductionList () {
      if (!this.deliveryNo && !this.settlementOrderId) {
        return
      }
      this.loading = true
      GoodsApi.getSupplementaryDeductionInfo({
        deliveryNo: this.deliveryNo,
        settlementOrderId: this.settlementOrderId
      }).then(res => {
        if (res.success) {
          this.supplementaryDeductionList = res.data || []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    supDeductionSummaryMethod (param) {
      const { columns, data } = param
      const sums = []
      const sumProperties = ['amount']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        if (sumProperties.indexOf(column.property) !== -1) {
          let total = 0
          data.forEach(item => {
            let value = Number(item[column.property])
            if (item.paymentType === 1) { // 扣款加负号
              value = -value
            }
            if (!isNaN(value)) {
              total = BigNumber(value).plus(total)
            }
          })
          sums[index] = thousandsSeparate(total)
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  },
  mounted () {
  },
  destroyed () { }
}
</script>

<style scoped lang="scss">
</style>
