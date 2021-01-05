<template>
  <div>
    <MerchantNotice></MerchantNotice>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button type="primary">生成发货单</el-button>
        <el-button type="primary" plain>导出待发货商品详情</el-button>
      </SlTableToolbar>
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
      <SlTable ref="table" :tableData="tableData" :columns="columns" :selection="false"></SlTable>
    </SlListView>
  </div>
</template>

<script>
import MerchantNotice from './stayGroupedGoods/MerchantNotice'
import RecommondUrl from '@api/recommendProducts/recommendProductsUrl.js'
export default {
  name: 'StayGroupedGoods',
  components: {
    MerchantNotice
  },
  data () {
    return {
      activeIndex: '0',
      switchNavs: [],
      tableData: [],
      page: {
        pageIndex: 1,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'single-select',
          label: '订单状态',
          name: 'productStatus',
          data: {
            remoteUrl: RecommondUrl.recommendstatus,
            options: []
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
    this.switchNavs = this.getSwitchNavs()
  },
  methods: {
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
    getSwitchNavs () {
      return [{ 'index': 0, 'name': '全部', 'value': null, 'amount': 50 }, { 'index': 1, 'name': '已入驻', 'value': 1, 'amount': 28 }]
    },
    switchNav (index) {
      // let item = this.switchNavs[parseInt(index)]
      this.activeIndex = index
      this.gotoPage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
