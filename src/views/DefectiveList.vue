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
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <!-- 表格区域包含分页 -->
      <SlTable ref="table" :tableData="tableData" :columns="columns" :selection="false"></SlTable>
    </SlListView>
  </div>
</template>

<script>
import RecommondUrl from '@api/recommendProducts/recommendProductsUrl.js'

export default {
  name: 'DefectiveList',
  data () {
    return {
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
