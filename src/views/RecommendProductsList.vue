<template>
  <div class="recommond">
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="total"
      :pageIndex="pageIndex"
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
          <el-button type="text" @click="maintain(row,'modify')" class="btn">维护</el-button>
          <el-button type="text" @click="maintain(row,'view')" class="btn">查看</el-button>
          <el-button type="text" @click="recommon(row)" class="btn">推品</el-button>
          <el-button type="text" @click="deleteProduct(row)" class="btn">删除</el-button>
          <el-button type="text" @click="cancel(row)" class="btn">取消推品</el-button>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>
<script>
import { successNotify, errorNotify } from '@shared/util'

import RecommondApi from '@api/recommendProducts/recommendProducts.js'
export default {
  data () {
    return {
      tableData: [],
      selections: [], // 复选框数据R
      pageIndex: 1, // 页数
      total: 0, // 总数
      pageSize: 10,
      category: undefined,
      query: {
        categoryName: '',
        itemNo: '',
        status: ''
      },
      searchItems: [
        { type: 'input', label: '品类', name: 'categoryName' },
        { type: 'input', label: '供方货号', name: 'itemNo' },
        { type: 'component', label: '品类', name: 'itemNo', componentName: 'SlCategory' },
        {
          type: 'single-select',
          label: '状态',
          name: 'status',
          data: {
            options: [
              { 'value': 1, 'label': '待推品' },
              { 'value': 2, 'label': '已推品' },
              { 'value': 3, 'label': '被选品' },
              { 'value': 4, 'label': '询盘中' }
            ]
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
          prop: 'status',
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
    gotoPage (pageSize, pageIndex) {
      const RECOMMONDPAR = { ...this.query, pageIndex, pageSize }
      RecommondApi.getRecommedList({ ...RECOMMONDPAR })
        .then((res) => {
          const { list, total } = res.data
          this.tableData = list
          console.log(list)
          // this.tableData = [
          //   {
          //     id: 111,
          //     date: '2016-05-04',
          //     name: '王小虎',
          //     storeName: 'ffeersd',
          //     img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605852642005&di=3e20d8008a8d9fe08528b0cdb2549fe1&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Fmw690%2F7ff6fc1fly1gf16gku4ahj20j60j6ae4.jpg',
          //     skuCode: '上海市普陀区江路 1517 弄',
          //     url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          //     startTime: '2020-11-16',
          //     creatTime: '2020-11-18'
          //   },
          //   {
          //     id: 111,
          //     date: '2016-05-04',
          //     name: '王小虎',
          //     storeName: 'ffeersd',
          //     img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605852642005&di=3e20d8008a8d9fe08528b0cdb2549fe1&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Fmw690%2F7ff6fc1fly1gf16gku4ahj20j60j6ae4.jpg',
          //     skuCode: '上海市普陀区江路 1517 弄',
          //     url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          //     startTime: '2020-11-16',
          //     creatTime: '2020-11-18'
          //   }
          // ]
          this.total = total
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
      // 判断批量推品还是单独推品
      const PUSHPRODUCTS = SELECTIONARR && SELECTIONARR.length > 0 ? SELECTIONARR : [row.id]
      RecommondApi.recommend({ productIdList: PUSHPRODUCTS })
        .then(() => {
          successNotify(this, `供方货号：${row.itemNo}推品成功`)
        })
        .catch(() => {
          errorNotify(this, `供方货号：${row.itemNo}推品失败`)
        })
    },
    deleteProduct (row) {
      RecommondApi.deleteRecommed(row.id)
        .then(res => {
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
