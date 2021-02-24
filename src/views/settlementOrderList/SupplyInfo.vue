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
import GoodsApi from '@api/goods'
export default {
  name: 'SupplyInfo',
  props: {
  },
  data () {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      columns: [
        {
          prop: 'purchaseOrderNo',
          label: '采购订单号',
          width: '150'
        },
        {
          prop: 'deliveryNo',
          label: '发货单号',
          width: '150'
        },
        {
          prop: 'sku',
          label: 'SKU',
          width: '100'
        },
        {
          prop: 'supplierSkuCode',
          label: '商家SKU',
          width: '80'
        },
        {
          prop: 'supplierItemNo',
          label: '供方货号',
          width: '120'
        },
        {
          prop: 'salesAttributes',
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
          label: '供货单价'
        },
        {
          prop: 'supplierAmount',
          label: '供货总金额',
          width: '100'
        }
      ]
    }
  },
  components: {

  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getPurchaseTableList(params).then(res => {
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
      // let { paymentAts = [], ...orther } = this.query
      let { cTimes = [], uTimes = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        cStartTime: cTimes && cTimes[0] ? cTimes[0] : '',
        cEndTime: cTimes && cTimes[1] ? cTimes[1] : '',
        uStartTime: uTimes && uTimes[0] ? uTimes[0] : '',
        uEndTime: uTimes && uTimes[1] ? uTimes[1] : ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
