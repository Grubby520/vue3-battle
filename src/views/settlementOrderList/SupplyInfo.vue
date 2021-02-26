<template>
  <SlListView
    ref="listView"
    @gotoPage="gotoPage"
    :total="page.total"
    :pageIndex="page.pageIndex"
    :pageSize="page.pageSize"
  >
    <SlTable
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :selection="false"
      :operate="false"
      :tooltip="false"
    ></SlTable>
  </SlListView>
</template>

<script>
import { thousandsSeparate } from '@shared/util'
import GoodsApi from '@api/goods'

export default {
  name: 'SupplyInfo',
  props: {
    deliveryNo: {
      type: String,
      default: ''
    },
    settlementOrderNo: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {
        deliveryNo: this.deliveryNo,
        settlementOrderNo: this.settlementOrderNo
      },
      columns: [
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
          width: '100'
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
          prop: 'attributesNam',
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
            return thousandsSeparate(row.supplierPrice)
          }
        },
        {
          prop: 'supplierTotalAmount',
          label: '供货总金额',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplierTotalAmount)
          }
        }
      ]
    }
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      if (!params.deliveryNo && !params.settlementOrderNo) {
        return
      }
      GoodsApi.getSupplyDetails(params).then(res => {
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
    generateParams (pageSize, pageIndex) {
      return {
        ...this.query,
        pageIndex,
        pageSize
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
