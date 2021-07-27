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
        <el-button type="text" size="medium" @click="$router.go(-1)" style="padding:0">返回</el-button>
      </div>
      <el-row>
        <el-col :span="4" v-for="prop in productionOrderComputedProps" :key="prop.value">
          <div style="line-height:2">
            <span class="color-text--primary mr-8px">{{prop.label}}:</span>
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
        maxHeight="400px"
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
        :addWrapClass="false"
        childName="detailListVoList"
      >
        <template v-slot:header="{row}">
          <ul class="display-inline-block">
            <li class="display-inline-block mr-24px">
              <span class="color-text--primary mr-8px">发货单号:</span>
              <span class="color-text--minor">{{row.deliveryOrderNumber}}</span>
            </li>
            <li class="display-inline-block mr-24px">
              <span class="color-text--primary mr-8px">装箱单号:</span>
              <span class="color-text--minor">{{row.deliveryOrderPackageNumber}}</span>
            </li>
            <li class="display-inline-block">
              <span class="color-text--primary mr-8px">物流单号:</span>
              <span class="color-text--minor">{{row.logisticsBillNumber}}</span>
            </li>
          </ul>
          <ul class="float-right">
            <li class="display-inline-block mr-24px">
              <span class="color-text--primary mr-8px">发货时间:</span>
              <span class="color-text--minor">{{row.createdAt}}</span>
            </li>
            <li class="display-inline-block">
              <span class="color-text--primary mr-8px">状态:</span>
              <el-tag>{{row.statusName}}</el-tag>
            </li>
          </ul>
        </template>
      </SlCardTable>
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
      titleStyle: { marginBottom: '0px', display: 'inline-block' },
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
      deliveryDetailListColumns: [
        {
          prop: 'skuCode',
          label: 'SKU编码'
        },
        {
          prop: 'productName',
          label: '商品名称'
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: 'supplierSkuAttr',
          label: '采购属性'
        },
        {
          prop: 'deliveryQuantity',
          label: '实际发货数量'
        },
        {
          prop: 'unpackQuantity',
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
      OemGoodsAPI.getProductionOrderDetail({
        ...this.$route.query,
        status: parseInt(this.$route.query.status)
      }).then(res => {
        let { data = {}, data: { deliveryOrderDetailList = [], purchaseOrderItemVoList = [] } } = res
        this.purchaseOrderList = purchaseOrderItemVoList
        this.deliveryDetailList = deliveryOrderDetailList
        this.productionOrderProps.forEach(item => {
          this.productionOrderData[item.value] = data[item.value]
        })
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
