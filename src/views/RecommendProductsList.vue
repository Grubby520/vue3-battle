<template>
  <div class="recommond">
    <SlListView
      @gotoPage="gotoPage"
      @reset="reset"
      :total="total"
      :pageIndex="pageIndex"
      class="recommonPar"
    >
      <div slot="search">
        <SlSearchForm v-model="query" :items="searchItems" />
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button type="primary" @click="recommon">批量推品</el-button>
        <el-button type="primary" @click="uploadSpu">导入SPU</el-button>
        <el-button type="primary" @click="uploadImages">导入商品图片</el-button>
      </SlTableToolbar>
      <SlTable ref="table" :tableData="tableData" :columns="columns" v-model="selections">
        <div slot="operation" slot-scope="{row}">
          <span @click="maintain(row,'create')" class="btn">维护</span>
          <span @click="maintain(row,'view')" class="btn">查看</span>
          <span @click="recommon(row)" class="btn">推品</span>
          <span @click="deleteProduct(row)" class="btn">删除</span>
          <span @click="cancel(row)" class="btn">取消推品</span>
        </div>
      </SlTable>
    </SlListView>
  </div>
</template>
<script>
import { successNotify, errorNotify } from '@shared/util'

// import recommond from '@api/recommendProducts/recommendProducts.js'
export default {
  data () {
    return {
      tableData: [],
      selections: [], // 复选框数据
      pageIndex: 1, // 页数
      total: 0, // 总页数
      pageSize: 10,
      query: {
        categoryName: '',
        itemNo: '',
        status: ''
      },
      searchItems: [
        { type: 'input', label: '品类', name: 'categoryName' },
        { type: 'input', label: '供方货号', name: 'itemNo' },
        {
          type: 'select',
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
          isInImg: 'img',
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
      // const RECOMMONDPAR = { ...this.searchPar, pageIndex, pageSize }
      // recommond.getList({ ...RECOMMONDPAR })
      //   .then((res) => {
      //     // debugger
      //     const { data, total } = res
      //     this.tableData = data
      //     console.log(data)
      this.tableData = [
        {
          id: 111,
          date: '2016-05-04',
          name: '王小虎',
          storeName: 'ffeersd',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605852642005&di=3e20d8008a8d9fe08528b0cdb2549fe1&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Fmw690%2F7ff6fc1fly1gf16gku4ahj20j60j6ae4.jpg',
          skuCode: '上海市普陀区江路 1517 弄',
          url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          startTime: '2020-11-16',
          creatTime: '2020-11-18'
        },
        {
          id: 111,
          date: '2016-05-04',
          name: '王小虎',
          storeName: 'ffeersd',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605852642005&di=3e20d8008a8d9fe08528b0cdb2549fe1&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Fmw690%2F7ff6fc1fly1gf16gku4ahj20j60j6ae4.jpg',
          skuCode: '上海市普陀区江路 1517 弄',
          url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          startTime: '2020-11-16',
          creatTime: '2020-11-18'
        }
      ]
      // this.total = total
      // })
    },
    reset () {
      this.query.categoryName = ''
      this.query.itemNo = ''
      this.query.status = ''
    },
    recommon (row) {
      // this.$refs.table.$refs.multipleTable.toggleAllSelection() // 全选
      const selectionArr = this.selections.reduce((init, a) => init.concat(a.id), [])
      console.log(selectionArr)
      successNotify(this, `供方货号：${row.id}推品成功`)
      errorNotify(this, `供方货号：${row.id}推品失败`)
    },
    deleteProduct (row) {
      successNotify(this, `供方货号：${row.id}删除推品成功`)
      errorNotify(this, `供方货号：${row.id}删除推品失败`)
    },
    cancel (row) {
      successNotify(this, `供方货号：${row.id}取消推品成功`)
      errorNotify(this, `供方货号：${row.id}取消推品失败`)
    },
    maintain (row, status) {
      this.$router.push({ path: '/home/recommend-products/maintain', query: { mode: status } })
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
