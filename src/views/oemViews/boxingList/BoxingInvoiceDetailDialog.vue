<template>
  <SlDialog title="装箱单明细" :visible.sync="deliverDialogVisible" :width="dialogWidth">
    <div v-loading="loading">
      <SlTable
        ref="table"
        align="left"
        :selection="false"
        :border="true"
        :tableData="tableData"
        :columns="columns"
        :operate="false"
        :tooltip="false"
        :isEmbedTable="true"
        maxHeight="320px"
      ></SlTable>
    </div>
    <template v-slot:bottom>
      <el-button @click="deliverDialogVisible = false">关闭</el-button>
    </template>
  </SlDialog>
</template>
<script>
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'BoxingInvoiceDetailDialog',
  props: {},
  data () {
    return {
      loading: false,
      handleLoading: false,
      deliverDialogVisible: false,
      dialogWidth: '60%',
      tableData: [],
      columns: [
        {
          prop: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          prop: 'deliveryOrderNumber',
          label: '发货单号'
        },
        {
          prop: 'sku',
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
          prop: 'goodsName',
          label: '商品名称'
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: '',
          label: '跟单信息',
          width: '200px',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <div>
                <p>需求到货时间：{this.formatDate(row.claimArrivalDate)}</p>
                <p>预计到货时间：{this.formatDate(row.estimatedArrivalDate)}</p>
              </div>
            )
          }
        },
        {
          prop: 'purchasePrice',
          label: '采购单价'
        },
        {
          prop: 'deliveryQuantity',
          label: '实际发货数量'
        },
        {
          prop: 'deliveryStatusName',
          label: '发货单异常'
        }
      ]
    }
  },
  methods: {
    openDialog (orderNumber) {
      this.deliverDialogVisible = true
      this.loading = true
      OemGoodsAPI.getDeliveryPackageItem({ orderNumber }).then(res => {
        let { data = [] } = res
        this.tableData = data
      }).finally(() => {
        this.loading = false
      })
    },
    formatDate (date) {
      if (date) {
        return date.split(' ')[0]
      }
      return '--'
    }
  }
}
</script>
<style lang="scss">
</style>
