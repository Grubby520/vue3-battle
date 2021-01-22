<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems">
          <template v-slot:before>
            <div class="table-search-statistics">
              <SlCheckedList
                v-model="statistics[0]"
                :options="ungroupedStatistics"
                label="未组单"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange(0,$event)"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="statistics[1]"
                :options="notShippedStatistics"
                label="已组单未发货"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange(1,$event)"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="statistics[2]"
                :options="notArrivedStatistics"
                label="已发货未到货"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange(2,$event)"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
            </div>
          </template>
        </SlSearchForm>
      </div>
      <el-divider />
      <div class="switch-nav">
        <el-menu
          :default-active="activeIndex"
          class="color-bg--white"
          mode="horizontal"
          @select="switchNav"
        >
          <el-menu-item
            v-for="(item,index) in switchNavs"
            :key="'index'+index"
            :index="item.index+''"
          >{{item.name}}({{item.amount?item.amount:0}})</el-menu-item>
        </el-menu>
      </div>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        :selection="false"
        :operate="false"
        :tooltip="false"
        rowKey="id"
      ></SlTable>
    </SlListView>
  </div>
</template>

<script>
import { date } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsApi from '@api/goods'

export default {
  name: 'PurchaseList',
  data () {
    return {
      activeIndex: '-1',
      ungroupedStatistics: [], // 未组单统计
      notShippedStatistics: [], // 已组单未发货
      notArrivedStatistics: [], // 已发货未到货
      switchNavs: [],
      tableData: [],
      statistics: {
        0: undefined,
        1: undefined,
        2: undefined
      },
      page: {
        pageIndex: 1,
        total: 0
      },
      query: {
        tabType: -1,
        type: -1,
        dayNum: -1
      },
      searchItems: [
        {
          type: 'single-select',
          label: '订单状态',
          name: 'orderState',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
          }
        },
        {
          type: 'input',
          label: '订单号',
          name: 'orderId'
        },
        {
          type: 'input',
          label: 'SKU',
          name: 'sku'
        },
        {
          type: 'input',
          label: '发货单号',
          name: 'deliveryId'
        },
        {
          type: 'single-select',
          label: '订单类型',
          name: 'orderType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_TYPE' }
          }
        },
        {
          type: 'date',
          label: '创建时间',
          name: 'cTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        },
        {
          type: 'date',
          label: '更新时间',
          name: 'uTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'orderId',
          label: '订单号'
        },
        {
          prop: 'baseInfo',
          label: '基本信息',
          width: '200',
          isInImg: 'imageUrl',
          pre: {
            supplierItemNo: '供方货号',
            merchantSku: '商家SKU',
            sku: 'SKU',
            spu: 'SPU'
          },
          data: {
            imgSize: '5rem'
          }
        },
        {
          prop: 'productName',
          label: '商品名称',
          width: '225',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip content={row.productName} placement="top" effect="light">
                <ellipsis text={row.productName} lineNum={2} tagName="p" width='225px'></ellipsis>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'sellProperty',
          label: '销售属性'
        },
        {
          prop: 'orderTypeDes',
          label: '订单类型'
        },
        {
          prop: 'orderStateDes',
          label: '订单状态'
        },
        {
          prop: 'orderPlan',
          label: '订单进度',
          width: '150',
          headerRender: function (h, column) {
            return (
              <div>订单进度<p class="color-text--gray-mid" style="transform:scale(0.8);font-weight:normal">(需求数/组单数/发货数/上架数)</p></div>
            )
          },
          render: function (h, data) {
            let { row = {} } = data
            let { orderPlan = {} } = row
            return (
              <span>
                {
                  (orderPlan.requiredQuantity ? orderPlan.requiredQuantity : 0) + '/' +
                  (orderPlan.groupQuantity ? orderPlan.groupQuantity : 0) + '/' +
                  (orderPlan.deliveryQuantity ? orderPlan.deliveryQuantity : 0) + '/' +
                  (orderPlan.arrivalQuantity ? orderPlan.arrivalQuantity : 0)
                }
              </span>
            )
          }
        },
        {
          prop: 'ctime',
          label: '时间',
          width: '200',
          render: function (h, data) {
            let { row = {} } = data
            let cTimeArr = row.ctime
            return (
              cTimeArr.map(item => {
                if (!item.timeStamp) return ''
                return (
                  <div>
                    <span>{item.typeDes}:</span>
                    <span>{item.timeStamp}</span>
                  </div>
                )
              })
            )
          }
        },
        {
          prop: 'dueDeliveryTime',
          label: '应交货时间',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            let dueDeliveryTime = row.dueDeliveryTime ? +new Date(row.dueDeliveryTime) : 0
            if (!row.dueDeliveryTime) return ''
            return (
              <p>{date(dueDeliveryTime, 'yyyy-MM-dd')}</p>
            )
          }
        },
        {
          prop: 'shippedNum',
          label: '发货单号'
        },
        {
          prop: 'logisticsNum',
          label: '物流单号'
        }
      ]
    }
  },
  mounted () {
    this.getStatistics(0).then(data => {
      this.ungroupedStatistics = data
    })
    this.getStatistics(1).then(data => {
      this.notShippedStatistics = data
    })
    this.getStatistics(2).then(data => {
      this.notArrivedStatistics = data
    })
  },
  methods: {
    getStatistics (type) {
      return GoodsApi.getPurchaseStatistics({ type })
    },
    getSwitchNavs () {
      GoodsApi.getPurchaseTabs({}).then(data => {
        this.switchNavs = data
      })
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getPurchaseTableList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = data.pageNum
        }
      }).finally(() => {
        this.$refs.listView.loading = false
        this.getSwitchNavs()
      })
    },
    reset () {
      this.resetParams()
      this.query.tabType = this.activeIndex
      this.$refs.listView.refresh()
    },
    switchNav (index) {
      this.resetParams()
      this.activeIndex = this.query.tabType = index
      if (this.activeIndex !== '-1') {
        this.deleteSearchItem('orderState')
      } else {
        this.addSearchItem('orderState')
      }
      this.gotoPage()
    },
    checkedListChange (type, value) {
      this.resetParams()
      this.activeIndex = this.query.tabType + ''
      if (typeof value !== 'undefined') {
        this.query.type = type
        this.query.dayNum = value
        this.statistics[type] = value
      }
      this.addSearchItem('orderState')
      this.gotoPage()
    },
    resetParams () {
      this.$refs.searchForm.reset()
      this.statistics = {
        0: undefined,
        1: undefined,
        2: undefined
      }
    },
    generateParams (pageSize, pageIndex) {
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
    },
    addSearchItem (name = 'orderState') {
      let index = this.searchItems.findIndex(item => item.name === name)
      let itemMap = {
        orderState: {
          type: 'single-select',
          label: '订单状态',
          name: 'orderState',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
          }
        }
      }
      // 加上订单状态搜索条件
      if (index === -1) {
        this.searchItems.unshift(itemMap[name])
      }
    },
    deleteSearchItem (name = 'orderState') {
      let index = this.searchItems.findIndex(item => item.name === name)
      if (index !== -1) {
        this.searchItems.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
