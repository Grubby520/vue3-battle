<template>
  <SlDialog title="发货单明细" :visible.sync="deliverDialogVisible" :width="dialogWidth">
    <div v-loading="loading">
      <SlCardTable
        ref="cardTable"
        :data="tableData"
        :childColumns="childColumns"
        :columns="columns"
        :addWrapClass="false"
        childName="detailListVoList"
      ></SlCardTable>
    </div>
    <template v-slot:bottom>
      <el-button @click="deliverDialogVisible = false">关闭</el-button>
    </template>
  </SlDialog>
</template>
<script>
import { isEmpty, errorMessageTip } from '@shared/util'
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'DeliveryDetailDialog',
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
          prop: 'deliveryOrderNumber',
          label: '发货单号'
        },
        {
          prop: 'deliveryOrderPackageNumber',
          label: '装箱单号'
        },
        {
          prop: 'logisticsBillNumber',
          label: '物流单号'
        },
        {
          prop: 'statusName',
          label: '状态'
        }
      ],
      childColumns: [
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
  methods: {
    openDialog (id) {
      this.deliverDialogVisible = true
      this.loading = true
      OemGoodsAPI.genDeliverDetailInfo(id).then(res => {
        let { data = {}, error } = res
        if (error && error.code === '500005') {
          errorMessageTip(error.message)
          this.tableData = []
          return
        }
        if (isEmpty(data)) {
          this.tableData = []
        } else {
          this.tableData = [data]
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
</style>
