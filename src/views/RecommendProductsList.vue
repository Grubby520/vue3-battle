<template>
  <div class="recommond">
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      class="recommonPar"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm
          v-model="query"
          :items="searchItems"
          :labelWidth="20"
          ref="searchForm"
          v-if="filterIsLoad"
        />
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button type="primary" @click="commit" :disabled="selections.length <= 0">批量提交</el-button>
        <el-button type="primary" @click="productDetail('create','')" class="recommond-create">创建产品</el-button>
      </SlTableToolbar>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        v-model="selections"
        :disabledKeys="disabledKeys"
        :tooltip="false"
      >
        <div slot="operation" slot-scope="{row}" class="operate">
          <el-button @click="productDetail('modify',row)" v-if="row.status.value===0" type="text">编辑</el-button>
          <el-button @click="productDetail('view',row)" type="text">查看</el-button>
          <el-button @click="productDetail('modify',row)" v-if="row.status.value===2" type="text">修改</el-button>
          <el-button @click="commit(row)" v-if="row.status.value===0" type="text">提交</el-button>
          <el-button @click="cancel(row)" v-if="row.status.value===1" type="text">撤回</el-button>
          <el-button @click="deleteProduct(row)" v-if="row.status.value===0" type="text">删除</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>
<script>
import { successNotify, errorNotify, confirmBox } from '@shared/util'
import RecommondUrl from '@api/recommendProducts/recommendProductsUrl.js'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import CommonApi from '@api/api.js'
export default {
  data () {
    return {
      tableData: [],
      selections: [], // 复选框数据
      disabledKeys: [],
      page: {
        pageIndex: 1,
        total: 0
      },
      category: undefined,
      query: {
        supplierItemNo: '',
        status: ''
      },
      searchItems: [
        {
          default: null,
          type: 'tree-select',
          label: '品类',
          isLabel: true,
          name: 'categoryId',
          data: {
            options: []
          }
        },
        { type: 'input', label: '供方货号', name: 'supplierItemNo', isLabel: true },
        {
          type: 'single-select',
          label: '状态',
          isLabel: true,
          name: 'status',
          data: {
            remoteUrl: RecommondUrl.recommendStatus,
            options: []
          }
        }
      ],
      columns: [
        {
          prop: '',
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
          prop: 'statusName',
          label: '状态'
        },
        {
          prop: '',
          label: '创建时间/更新时间',
          pre: {
            createTime: '创建',
            updateTime: '更新'
          }
        }
      ],
      // 搜索条件是否可以开始加载
      filterIsLoad: false
    }
  },
  mounted () {
    this.initFilter()
  },
  methods: {
    /**
     * 初始化筛选的基础数据
     */
    initFilter () {
      CommonApi.plmCategory().then((response) => {
        if (response.success) {
          let data = response.data
          this.shakingTree(data)
          this.searchItems[0].data.options = data
        }
      }).finally(() => {
        this.filterIsLoad = true
      })
    },
    /**
     * 对树的数据进行加工
     */
    shakingTree (treeData) {
      treeData.forEach((node) => {
        // 将树的id换成path
        node.id = node.levelPath
        if (node.children && node.children.length > 0) {
          this.shakingTree(node.children)
        } else {
          delete node.children
        }
      })
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      let requestParams = { ...this.query }
      // 将分类过滤取值赋给[categoryIdLevel]，[categoryId]取level的最后一级
      const path = requestParams.categoryId || ''
      requestParams.categoryIdLevel = path
      requestParams.categoryId = path.split(',').reverse()[0]
      const RECOMMONDPAR = { ...requestParams, pageIndex, pageSize }
      this.tableData = []
      RecommondApi.getList({ ...RECOMMONDPAR })
        .then((res) => {
          const { list, total } = res.data
          list.forEach(item => {
            if (item.description.length > 30) {
              item.description = item.description.substring(0, 30) + '...'
            }
            item.src = item.productImageUrlList[0]
            if (item.status) item.statusName = item.status.name
          })
          this.tableData = list
          this.$refs.listView.loading = false
          // 待推品复选框置灰数据
          this.disabledKeys = list.filter(item => item.status.value !== 0).map(item => item.id)
          this.page.total = total
        })
    },
    reset () {
      this.$refs.searchForm.reset()
      // 更新列表
      this.$refs.listView.refresh()
    },
    commit (row) {
      // 批量推品
      const selectionarr = this.selections.reduce((init, a) => init.concat(a.id), [])
      // 批量图品供方货号
      const supplierItemNo = this.selections.reduce((init, a) => init.concat(a.supplierItemNo), []).join(',')
      // 判断批量推品还是单独推品
      const commitParams = selectionarr && selectionarr.length > 0 ? selectionarr : [row.id]
      // 批量推品供方货号和单独供方货号
      const itemNoAll = selectionarr && selectionarr.length > 0 ? supplierItemNo : row.supplierItemNo
      confirmBox(this, '是否提交商品', '')
        .then(() => {
          RecommondApi.submit(commitParams)
            .then((res) => {
              if (res.success) {
                successNotify(this, `供方货号[${itemNoAll}]提交成功`, true)
                this.$refs.listView.refresh()
              } else {
                errorNotify(this, `供方货号[${itemNoAll}]${res.error.message}`, true, 4500, '')
              }
            })
        })
    },
    deleteProduct (row) {
      confirmBox(this, '是否删除商品', '')
        .then(() => {
          RecommondApi.deleteProduct(row.id)
            .then(res => {
              if (res.success) {
                this.gotoPage()
                successNotify(this, `供方货号[${row.supplierItemNo}]删除成功`)
              } else {
                errorNotify(this, `供方货号[${row.supplierItemNo}]${res.error.message}`, false, 4500, '')
              }
            })
        })
    },
    cancel (row) {
      confirmBox(this, '是否取消提交', '')
        .then(() => {
          RecommondApi.cancel(row.id)
            .then(res => {
              if (res.success) {
                this.$refs.listView.refresh()
                successNotify(this, `供方货号[${row.supplierItemNo}]取消提交成功`)
              } else {
                errorNotify(this, `供方货号[${row.supplierItemNo}]${res.error.message}`, false, 4500, '')
              }
            })
        })
    },
    productDetail (status, row) {
      const { id, categoryId, supplierItemNo } = row
      const params = { mode: status, id, categoryId, supplierItemNo }
      const routerPath = status === 'create' ? '/home/recommend-products/category' : '/home/recommend-products/productDetail'
      this.$router.push({ path: routerPath, query: params })
    }
  }
}
</script>
