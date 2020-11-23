<template>
  <div class="recommond">
    {{query}}
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      class="recommonPar"
    >
      <div slot="search">
        <!-- 搜索区域包含搜索和重置按钮 -->
        <SlSearchForm v-model="query" :items="searchItems" />
        <!-- <SlCategory v-model="category"></SlCategory> -->
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button type="primary" @click="recommon">批量推品</el-button>
        <el-button type="primary" @click="uploadSpu">导入SPU</el-button>
        <el-button type="primary" @click="uploadImages">导入商品图片</el-button>
      </SlTableToolbar>
      <!-- 表格区域包含分页 -->
      <SlTable ref="table" :tableData="tableData" :columns="columns" v-model="selections">
        <div slot="operation" slot-scope="{row}">
          <span @click="maintain(row,'modify')" class="btn">维护</span>
          <span type="text" @click="maintain(row,'view')" class="btn">查看</span>
          <span type="text" @click="recommon(row)" class="btn">推品</span>
          <span type="text" @click="deleteProduct(row)" class="btn">删除</span>
          <span type="text" @click="cancel(row)" class="btn">取消推品</span>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>
<script>
import { successNotify, errorNotify } from '@shared/util'
import RecommondUrl from '@api/recommendProducts/recommendProductsUrl.js'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
export default {
  data () {
    return {
      tableData: [],
      selections: [], // 复选框数据
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      category: undefined,
      query: {
        categoryName: '',
        itemNo: '',
        status: ''
      },
      searchItems: [
        {
          type: 'single-select',
          label: '品类',
          name: 'categoryId',
          data: {
            remoteUrl: RecommondUrl.recommendCategory,
            options: []
          }
        },
        { type: 'input', label: '供方货号', name: 'itemNo' },
        {
          type: 'single-select',
          label: '状态',
          name: 'status',
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
          isInImg: 'coverImageUrl',
          pre: {
            productName: '商品名称',
            itemNo: '供方货号'
          }
        },
        {
          prop: 'categoryName',
          label: '品类'
        },
        {
          prop: 'supplyPrice',
          label: '供货价（元）'
        },
        {
          prop: 'productStatusName',
          label: '状态'
        },
        {
          prop: 'skuCode',
          label: '创建时间/更新时间',
          pre: {
            createTimes: '创建',
            updateTimes: '更新'
          }
        }
      ]
    }
  },

  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const RECOMMONDPAR = { ...this.query, pageIndex, pageSize }
      RecommondApi.getRecommedList({ ...RECOMMONDPAR })
        .then((res) => {
          const { list, total } = res.data
          this.tableData = list
          console.log(list)
          list.forEach(item => {
            item.createTimes = this.$moment(item.createTime).format('YYYY-M-D HH:mm')
            item.updateTimes = this.$moment(item.updateTime).format('YYYY-M-D HH:mm')
          })
          this.page.total = total
        })
    },
    reset () {
      this.query.categoryName = ''
      this.query.itemNo = ''
      this.query.status = ''
      // 更新列表
      this.$refs.listView.refresh()
    },
    recommon (row) {
      // this.$refs.table.$refs.multipleTable.toggleAllSelection() // 全选
      // 批量推品
      const SELECTIONARR = this.selections.reduce((init, a) => init.concat(a.id), [])
      // 批量图品供方货号
      const ITEMNOALLARR = this.selections.reduce((init, a) => init.concat(a.itemNo), []).join(',')
      // 判断批量推品还是单独推品
      const PUSHPRODUCTS = SELECTIONARR && SELECTIONARR.length > 0 ? SELECTIONARR : [row.id]
      // 批量推品供方货号和单独供方货号
      const ITEMNOALL = SELECTIONARR && SELECTIONARR.length > 0 ? ITEMNOALLARR : row.itemNo
      RecommondApi.recommend({ productIdList: PUSHPRODUCTS })
        .then(() => {
          successNotify(this, `供方货号：${ITEMNOALL}推品成功`)
        })
        .catch(() => {
          errorNotify(this, `供方货号：${ITEMNOALL}推品失败`)
        })
    },
    deleteProduct (row) {
      RecommondApi.deleteRecommed(row.id)
        .then(res => {
          // 删除成功重新渲染页面
          this.$refs.listView.refresh()
          successNotify(this, `供方货号：${row.itemNo}删除推品成功`)
        })
        .catch(res => {
          errorNotify(this, `供方货号：${row.itemNo}删除推品失败`)
        })
    },
    cancel (row) {
      const params = row.id
      RecommondApi.cancelrcommend({ productIdList: [params] })
        .then(res => {
          successNotify(this, `供方货号：${row.itemNo}取消推品成功`)
        })
        .catch(() => {
          errorNotify(this, `供方货号：${row.itemNo}取消推品失败`)
        })
    },
    maintain (row, status) {
      this.$router.push({ path: '/home/recommend-products/maintain', query: { mode: status, id: row.id } })
    },
    uploadSpu () {
      this.$router.push({ path: '/home/recommend-products/import-spu' })
    },
    uploadImages () {
      this.$router.push({ path: '/home/recommend-products/import-product-imgs' })
    }
  }
}
</script>
<style lang="scss" scoped>
.recommond {
}
</style>
