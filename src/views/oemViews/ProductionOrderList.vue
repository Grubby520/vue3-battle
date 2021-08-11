<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
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
      <SlSwitchNav :navs="switchNavs" :default-active="switchActiveIndex" @select="switchNav">
        <template v-slot:custom="{tab}">{{tab.tabName}}({{tab.count}})</template>
      </SlSwitchNav>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        align="left"
        :selection="false"
        :border="false"
        :tableData="tableData"
        :columns="columns"
        :operate="true"
        :tooltip="false"
        rowKey="id"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="viewDetailInfo(row)">查看</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>

<script>
import OemGoodsAPI from '@api/oemGoods'
import { setSessionItem, getSessionItem, removeSessionItem } from '@shared/util'

export default {
  name: 'ProductionOrderList',
  components: {},
  data () {
    return {
      loading: false,
      tableData: [],
      switchNavs: [],
      switchActiveIndex: '0',
      formQuery: {},
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
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
      pageFromDetail: false,
      cachePageStatus: {
        switchActiveIndex: '0',
        formQuery: {},
        page: {
          pageIndex: 1,
          pageSize: 10
        }
      }
    }
  },
  watch: {
    formQuery: {
      handler () {
        this.updateCachePageStatus()
      },
      deep: true
    }
  },
  computed: {
    columns () {
      const defaultColumns = [
        {
          prop: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          prop: 'skuQuantity',
          label: 'SKU总数'
        },
        {
          prop: 'requireQuantity',
          label: '订单总件数'
        },
        {
          prop: 'totalAmount',
          label: '订单金额'
        },
        {
          prop: 'orderTime',
          label: '下单时间'
        }
      ]
      const dynamicColumns = [
        {
          prop: 'deliveryQuantity',
          label: '总发货数'
        },
        {
          prop: 'inInventoryQuantity',
          label: '总入库数'
        },
        {
          prop: 'lessStockQuantity',
          label: '总少货数'
        }
      ]
      let arr = [].concat(defaultColumns)
      // 送货中、已完成、已取消、已结算状态的生产订单会多展示几列
      if (['2', '3', '4', '5'].includes(this.switchActiveIndex)) {
        arr.splice(3, 0, ...dynamicColumns)
      }
      return arr
    }
  },
  created () {
    if (getSessionItem('isFromDetail')) {
      let productionOrderListStatus = JSON.parse(getSessionItem('ProdOrderListStatusCache'))
      this.page = Object.assign({}, productionOrderListStatus.page)
      this.switchActiveIndex = productionOrderListStatus.switchActiveIndex
      this.formQuery = productionOrderListStatus.formQuery
      this.removeSessionItems()
    }
  },
  mounted () { },
  beforeRouteEnter (to, from, next) {
    if (from.path.includes('production-order-detail')) {
      setSessionItem('isFromDetail', true)
    }
    next()
  },

  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.loading = true
      OemGoodsAPI.getProductionOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.getSwitchNavs()
          this.updateCachePageStatus()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    reset () {
      this.switchActiveIndex = '0'
      Object.keys(this.formQuery).forEach(key => {
        this.formQuery[key] = null
      })
      this.removeSessionItems()
      this.gotoPage(this.page.pageSize)
    },
    getSwitchNavs () {
      OemGoodsAPI.getProductionOrderStatic(this.getQureyParams()).then(res => {
        let { data = [] } = res
        this.switchNavs = data || []
      })
    },
    switchNav (index) {
      this.switchActiveIndex = index
      this.gotoPage()
    },
    viewDetailInfo ({ id }) {
      this.$router.push({
        path: '/home/oem-order-manage/production-order-detail',
        query: {
          purchaseOrderId: id,
          status: this.switchActiveIndex
        }
      })
    },
    generateParams (pageSize, pageIndex) {
      return {
        ...this.getQureyParams(),
        status: parseInt(this.switchActiveIndex),
        pageIndex,
        pageSize
      }
    },
    getQureyParams () {
      let { orderTimes = [], ...orther } = this.formQuery
      return {
        ...orther,
        orderTimeStart: orderTimes && orderTimes[0] ? orderTimes[0] : '',
        orderTimeEnd: orderTimes && orderTimes[1] ? orderTimes[1] : ''
      }
    },
    updateCachePageStatus () {
      this.cachePageStatus.switchActiveIndex = this.switchActiveIndex
      this.cachePageStatus.formQuery = Object.assign({}, this.formQuery)
      this.cachePageStatus.page = Object.assign({}, this.page)
      setSessionItem('ProdOrderListStatusCache', JSON.stringify(this.cachePageStatus))
    },
    removeSessionItems () {
      removeSessionItem('ProdOrderListStatusCache')
      removeSessionItem('isFromDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
