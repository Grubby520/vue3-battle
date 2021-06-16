<template>
  <div v-loading="loading">
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="生产订单详情"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <el-row>
        <el-col :span="4" v-for="prop in productionOrderComputedProps" :key="prop.value">
          <div style="line-height:2">
            <span class="color-text--primary">{{prop.label}}：</span>
            <span class="color-text--minor">{{productionOrderData[prop.value]}}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="商品明细"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlTable
        ref="table"
        align="left"
        :selection="false"
        :border="false"
        :tableData="purchaseOrderList"
        :columns="purchaseOrderListColumns"
        :operate="false"
        :tooltip="false"
        :isEmbedTable="true"
        height="480px"
        rowKey="id"
      ></SlTable>
    </el-card>
    <el-card v-if="showDeliveryDetail" class="mb-2rem" shadow="never">
      <div slot="header" class="clearfix">
        <SlContentTitle
          text="发货单明细"
          :fontSize="titleFontSize"
          :line="false"
          :titleStyle="titleStyle"
          columnIcon
        ></SlContentTitle>
      </div>
      <SlCardTable
        ref="cardTable"
        :data="deliveryDetailList"
        :childColumns="deliveryDetailListColumns"
        :columns="deliveryDetailColumns"
        :addWrapClass="false"
        childName="detailListVoList"
      ></SlCardTable>
    </el-card>
  </div>
</template>

<script>
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'ProductionOrderDetail',
  props: {},
  data () {
    return {
      loading: false,
      titleFontSize: '1.4rem',
      titleStyle: { marginBottom: '0px' },
      purchaseOrderList: [],
      productionOrderData: {},
      productionOrderProps: [
        {
          label: '生产订单号',
          value: 'purchaseOrderNumber'
        },
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
          value: 'settlementWayName'
        },
        {
          label: '供应商类型',
          value: 'supplierCategoryName'
        },
        {
          label: 'SKU总数',
          value: 'skuQuantity'
        },
        {
          label: '总订单数',
          value: 'requireQuantity'
        },
        {
          label: '总发货数',
          value: 'deliveryQuantity'
        },
        {
          label: '总入库数',
          value: 'inInventoryQuantity'
        },
        {
          label: '总少货数',
          value: 'lessStockQuantity'
        },
        {
          label: '订单总金额',
          value: 'totalAmount'
        },
        {
          label: '下单时间',
          value: 'orderTime'
        }
      ],
      deliveryDetailList: [],
      deliveryDetailColumns: [],
      deliveryDetailListColumns: []
    }
  },
  computed: {
    productionOrderComputedProps () {
      let excludeLabels = ['总发货数', '总入库数', '总少货数']// 待接单、待发货状态的时不显示这些
      if (['0', '1'].includes(this.$route.query.status)) {
        return this.productionOrderProps.filter(item => !excludeLabels.includes(item.label))
      }
      return this.productionOrderProps
    },
    purchaseOrderListColumns () {
      let defaultColumns = [
        {
          prop: 'skuCode',
          label: 'SKU编码'
        },
        {
          prop: 'skuImage',
          label: '商品图片',
          isImg: true,
          data: {
            imgSize: '8rem'
          }
        },
        {
          prop: 'name',
          label: '商品名称'
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: 'orderTypeName',
          label: '订单类型'
        },
        {
          prop: 'claimArrivalDate',
          label: '应交货日期'
        },
        {
          prop: 'purchasePrice',
          label: '采购单价'
        },
        {
          prop: 'requireQuantity',
          label: '订单数量'
        },
        {
          prop: 'deliveryQuantity',
          label: '实际发货数量'
        },
        {
          prop: 'unpackedQuantity',
          label: '拆包数量'
        },
        {
          prop: 'inInventoryQuantity',
          label: '入库数量'
        },
        {
          prop: 'lessStockQuantity',
          label: '少货数量'
        }
      ]
      let excludeLabels = ['实际发货数量', '拆包数量', '入库数量', '少货数量']// 待接单、待发货状态的时不显示这些
      if (['0', '1'].includes(this.$route.query.status)) {
        return defaultColumns.filter(item => !excludeLabels.includes(item.label))
      }
      return defaultColumns
    },
    showDeliveryDetail () {
      return ['2', '3', '4', '5'].includes(this.$route.query.status)
    }
  },
  watch: {},
  created () {
    this.getDetailInfo()
  },
  methods: {
    getDetailInfo () {
      this.loading = true
      OemGoodsAPI.getProductionOrderDetail(this.$route.query).then(res => {
        let { success, data = {}, data: { deliveryOrderDetailList = [], purchaseOrderItemVoList = [] } } = res
        this.purchaseOrderList = purchaseOrderItemVoList
        this.deliveryDetailList = deliveryOrderDetailList
        this.productionOrderProps.forEach(item => {
          this.productionOrderData[item.value] = data[item.value]
        })

        console.log(success, deliveryOrderDetailList)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
  },
  destroyed () { }
}
</script>

<style scoped lang="scss">
</style>
