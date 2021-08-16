<template>
  <div v-loading="loading">
    <div class="mb-8px">
      <el-button type="text" size="medium" @click="$router.go(-1)" style="padding:0">返回</el-button>
      <el-divider direction="vertical"></el-divider>
      <span class="color-text--primary mr-8px">结算单号:</span>
      <span class="color-text--minor mr-16px">{{settlementOrderNo}}</span>
      <template v-if="deliveryNo">
        <span class="color-text--primary mr-8px">发货单号:</span>
        <span class="color-text--minor">{{deliveryNo}}</span>
      </template>
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
        maxHeight="400px"
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
          align="left"
          :tableData="supplyList"
          :columns="supplyListColumns"
          :selection="false"
          :operate="false"
          :tooltip="false"
          :isEmbedTable="true"
        ></SlTable>
      </SlListView>
    </el-card>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { thousandsSeparate } from '@shared/util'
import SettlementApi from '@api/settlement'

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
      ]
    }
  },
  computed: {

  },
  watch: {},
  created () {
    this.getDeliveryInfo()
  },
  methods: {
    getDeliveryInfo () {
      if (!this.deliveryNo && !this.settlementOrderId) {
        return
      }
      this.loading = true
      SettlementApi.getDeliveryInfo({
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
      SettlementApi.getSupplyDetails({
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
    }
  },
  mounted () {
  },
  destroyed () { }
}
</script>

<style scoped lang="scss">
</style>
