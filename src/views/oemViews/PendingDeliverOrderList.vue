<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
      :pageSizes="pageSizes"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm
          ref="searchForm"
          v-model="formQuery"
          :items="searchItems"
          :loading="loading"
          @reset="reset"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>
      </div>
      <!-- tab切换 -->
      <SlSwitchNav
        align="right"
        :navs="switchNavs"
        :default-active="switchActiveIndex"
        @select="switchNav"
      >
        <template v-slot:left>
          <span class="pdl-2rem">
            <SlButton
              type="primary"
              boxShadow="primary"
              :loading="loading"
              :disabled="!canDelivery"
              @click="openDeliverDialog"
            >发货</SlButton>
          </span>
        </template>
        <template v-slot:custom="{tab}">{{tab.tabName}}({{tab.count}})</template>
      </SlSwitchNav>
      <!-- 表格区域包含分页 -->
      <SlCardTable
        ref="cardTable"
        :data="tableData"
        :columns="columns"
        childName="purchaseOrderItemVoList"
      >
        <template #body="{row:cardRow}">
          <SlTable
            ref="table"
            v-model="selectionsTree[cardRow.id]"
            align="left"
            :border="false"
            :tableData="cardRow['purchaseOrderItemVoList']"
            :columns="childColumns"
            :operate="false"
            :tooltip="false"
            :isEmbedTable="true"
            rowKey="id"
          ></SlTable>
        </template>
      </SlCardTable>
    </SlListView>
    <!-- 发货对话框 -->
    <DeliveryDialog ref="deliveryDialog" @submit="gotoPage"></DeliveryDialog>
  </div>
</template>

<script>
import OemGoodsAPI from '@api/oemGoods'
import DeliveryDialog from './pendingDeliverOrderList/DeliveryDialog.vue'

export default {
  name: 'PendingOrderList',
  components: {
    DeliveryDialog
  },
  data () {
    return {
      loading: false,
      tableData: [],
      selectionsTree: {},
      switchNavs: [],
      switchActiveIndex: '0',
      extraQuery: {
        status: 1
      },
      formQuery: {},
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      pageSizes: [10],
      searchItems: [
        {
          type: 'batch-input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: 'SKU编码',
          name: 'sku'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'commodityName'
        },
        {
          type: 'date',
          label: '下单时间',
          name: 'orderTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          prop: 'orderTime',
          label: '下单时间'
        }
      ],
      childColumns: [
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
          prop: 'realPrice',
          label: '单价'
        },
        {
          prop: 'requireQuantity',
          label: '订单数量'
        },
        {
          prop: 'deliveryQuantity',
          label: '实际发货量'
        },
        {
          prop: 'estimatedArrivalDate',
          label: '应交货时间'
        }
      ]
    }
  },
  computed: {
    canDelivery () {
      return Object.values(this.selectionsTree).some(selections => selections.length)
    }

  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.loading = true
      OemGoodsAPI.getPurchaseOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.selectionsTree = {}
          this.getSwitchNavs()
          this.tableData.forEach(row => {
            this.$set(this.selectionsTree, row.id, [])
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    reset () {
      this.switchActiveIndex = '0'
      this.gotoPage(this.page.pageSize)
    },
    getSwitchNavs () {
      OemGoodsAPI.getPendingDeliverStatic(this.getQureyParams()).then(res => {
        let { data = [] } = res
        this.switchNavs = data || []
      })
    },
    switchNav (index) {
      this.switchActiveIndex = index
      this.gotoPage()
    },
    openDeliverDialog () {
      let params = Object.keys(this.selectionsTree).reduce((prev, cur) => {
        let curSelections = this.selectionsTree[cur]
        if (curSelections.length > 0) {
          let arr = curSelections.map(item => {
            return {
              purchaseOrderId: cur,
              purchaseOrderItemId: item.id
            }
          })
          prev = prev.concat(arr)
        }
        return prev
      }, [])
      this.$refs.deliveryDialog.openDialog({ params })
    },
    generateParams (pageSize, pageIndex) {
      return {
        ...this.getQureyParams(),
        overdueDays: this.switchActiveIndex,
        pageIndex,
        pageSize
      }
    },
    getQureyParams () {
      let { orderTimes = [], ...orther } = this.formQuery
      return {
        ...orther,
        ...this.extraQuery,
        orderTimeStart: orderTimes && orderTimes[0] ? orderTimes[0] : '',
        orderTimeEnd: orderTimes && orderTimes[1] ? orderTimes[1] : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
