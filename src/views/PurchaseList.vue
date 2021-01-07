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
                v-model="query.ungrouped"
                :options="ungroupedStatistics"
                label="未组单"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="query.ungrouped"
                :options="notShippedStatistics"
                label="已组单未发货"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="query.ungrouped"
                :options="notArrivedStatistics"
                label="已发货未到货"
                gutter="3em"
                labelBold
                underline
                @change="checkedListChange"
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
      ></SlTable>
    </SlListView>
  </div>
</template>

<script>
import { date } from '@shared/util'
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
            options: []
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
          name: 'sku'
        },
        {
          type: 'single-select',
          label: '订单类型',
          name: 'orderType',
          data: {
            options: []
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
          width: '300',
          isInImg: 'imageUrl',
          pre: {
            supplierItemNo: '供方货号',
            merchantSku: '商家SKU',
            sku: 'SKU',
            spu: 'SPU'
          }
        },
        {
          prop: 'productName',
          label: '商品名称'
        },
        {
          prop: 'sellProperty',
          label: '销售属性'
        },
        {
          prop: 'orderType',
          label: '订单类型'
        },
        {
          prop: 'orderState',
          label: '订单状态'
        },
        {
          prop: 'orderPlan',
          label: '订单进度',
          headerRender: function (h, column) {
            return (
              <div>订单进度<p class="color-text--yellow">(需求数/组单数/发货数/到货数)</p></div>
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
          prop: 'cTime',
          label: '时间',
          width: '200',
          render: function (h, data) {
            let { row = {} } = data
            let cTimeArr = row.cTime
            return (
              cTimeArr.map(item => {
                if (!item.timeStamp) return ''
                return (
                  <div>
                    <span>{item.typeDes}:</span>
                    <span>{date(item.timeStamp, 'yyyy-MM-dd hh:mm:ss')}</span>
                  </div>
                )
              })
            )
          }
        },
        {
          prop: 'dueDeliveryTime',
          label: '应交货时间',
          render: (h, data) => {
            let { row = {} } = data

            return (
              <p>{date(row.dueDeliveryTime, 'yyyy-MM-dd hh:mm:ss')}</p>
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
    this.getSwitchNavs()
  },
  methods: {
    getStatistics (type) {
      return GoodsApi.getStatistics({ type })
    },
    getSwitchNavs () {
      GoodsApi.getTabs({}).then(data => {
        this.switchNavs = data
      })
    },
    generateParams () {
      return {}
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      // const params = { ...this.query, pageIndex, pageSize }
      this.tableData = [
        {
          orderId: 123123,
          dueDeliveryTime: 1610001839415,
          baseInfo: {
            supplierItemNo: '供方货号',
            merchantSku: '商家SKU',
            sku: 'SKU',
            spu: 'SPU'
          },
          orderPlan: {},
          cTime: [{
            timeStamp: '14234235324',
            type: 1,
            typeDes: '创建时间'
          },
          {
            timeStamp: '14234235324',
            type: 2,
            typeDes: '更新时间'
          }]
        }
      ]
      this.$refs.listView.loading = false
      this.page.total = 1
    },
    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },
    switchNav (index) {
      // let item = this.switchNavs[parseInt(index)]
      this.activeIndex = index
      this.gotoPage()
    },
    checkedListChange (value) {
      console.log(value)
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
