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
                :options="options"
                label="未组单"
                gutter="3em"
                labelBold
                @change="checkedListChange"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="query.ungrouped"
                :options="options1"
                label="已组单未发货"
                gutter="3em"
                labelBold
                @change="checkedListChange"
              >
                <template v-slot="{item}">{{item.label}}({{item.extra.amount}})</template>
              </SlCheckedList>
              <SlCheckedList
                v-model="query.ungrouped"
                :options="options2"
                label="已发货未到货"
                gutter="3em"
                labelBold
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
      <SlTable ref="table" v-model="selections" :tableData="tableData" :columns="columns"></SlTable>
    </SlListView>
  </div>
</template>

<script>

export default {
  name: 'PurchaseList',
  data () {
    return {
      activeIndex: '0',
      options: [],
      options1: [],
      options2: [],
      switchNavs: [],
      tableData: [],
      selections: [], // 复选框数据
      page: {
        pageIndex: 1,
        total: 0
      },
      query: {
        ungrouped: ''
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
          name: 'cTime',
          data: {
            datetype: 'date',
            isBlock: true
          }
        },
        {
          type: 'date',
          label: '更新时间',
          name: 'uTime',
          data: {
            datetype: 'date',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'productName',
          label: '商品信息',
          width: '300',
          isInImg: 'src',
          pre: {
            title: '商品名称',
            supplierItemNo: '供方货号',
            erpSpuCode: 'SPU'
          }
        },
        {
          prop: 'categoryName',
          label: '品类'
        },
        {
          prop: 'description',
          label: '商品描述'
        },
        {
          prop: 'productStatusName',
          label: '状态'
        },
        {
          prop: 'skuCode',
          label: '创建时间/更新时间',
          pre: {
            createTime: '创建',
            updateTime: '更新'
          }
        }
      ]
    }
  },
  mounted () {
    this.options = this.getOptions()
    this.options1 = this.getOptions1()
    this.options2 = this.getOptions2()
    this.switchNavs = this.getSwitchNavs()
  },
  methods: {
    getOptions () {
      return [
        {
          label: '全部未组单',
          value: '',
          extra: {
            amount: 0
          }
        }, {
          label: '1日未组单',
          value: '1',
          extra: {
            amount: 0
          }
        }, {
          label: '2日未组单',
          value: '2',
          extra: {
            amount: 0
          }
        }, {
          label: '3日未组单',
          value: '3',
          extra: {
            amount: 0
          }
        }, {
          label: '7日未组单',
          value: '7',
          extra: {
            amount: 0
          }
        }
      ]
    },
    getOptions1 () {
      return [
        {
          label: '全部已组单未发货',
          value: '',
          extra: {
            amount: 0
          }
        }, {
          label: '已组单1日未发货',
          value: '1',
          extra: {
            amount: 0
          }
        }, {
          label: '已组单2日未发货',
          value: '2',
          extra: {
            amount: 0
          }
        }, {
          label: '已组单3日未发货',
          value: '3',
          extra: {
            amount: 0
          }
        }
      ]
    },
    getOptions2 () {
      return [
        {
          label: '全部已发货未到货',
          value: '',
          extra: {
            amount: 0
          }
        }, {
          label: '发货后2日未到货',
          value: '1',
          extra: {
            amount: 0
          }
        }, {
          label: '发货后3日未到货',
          value: '2',
          extra: {
            amount: 0
          }
        }
      ]
    },
    getSwitchNavs () {
      return [{ 'index': 0, 'name': '全部', 'value': null, 'amount': 50 }, { 'index': 1, 'name': '已入驻', 'value': 1, 'amount': 28 }]
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      // const params = { ...this.query, pageIndex, pageSize }
      this.tableData = []
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
