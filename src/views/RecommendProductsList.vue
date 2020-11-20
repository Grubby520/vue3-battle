<template>
  <div class="recommond">
    <SlBaseListView
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
      <div class="recommond-btns">
        <el-button type="primary" @click="recommon">批量推品</el-button>
        <el-button type="primary" @click="uploadSpu">导入SPU</el-button>
        <el-button type="primary" @click="uploadImages">导入商品图片</el-button>
      </div>
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="operation" slot-scope="props">
          <span @click="maintain(props,'create')" class="btn">维护</span>
          <span @click="maintain(props,'view')" class="btn">查看</span>
          <span @click="recommon(props)" class="btn">推品</span>
          <span @click="deleteProduct(props)" class="btn">删除</span>
        </div>
      </SlTable>
    </SlBaseListView>
  </div>
</template>
<script>
import recommond from '@api/recommendProducts/recommendProducts.js'
export default {
  data () {
    return {
      recommonPar: {},
      tableData: [],
      selections: [],
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
          isInImg: 'imageSrc',
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
      this.recommonPar = { ...this.searchPar, pageIndex, pageSize }
      recommond.getList({ ...this.recommonPar })
        .then((res) => {
          // debugger
          const { data, total } = res
          this.tableData = data
          console.log(data)
          // this.tableData = [
          //   {
          //     date: '2016-05-04',
          //     name: '王小虎',
          //     storeName: 'ffeersd',
          //     img: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          //     skuCode: '上海市普陀区江路 1517 弄',
          //     url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          //     startTime: '2020-11-16',
          //     creatTime: '2020-11-18'
          //   }
          // ]
          this.total = total
        })
    },
    handleSelectionChange (val) {
      this.selections = val
      console.log(val)
    },
    reset () {
      this.query.categoryName = ''
      this.query.itemNo = ''
      this.query.status = ''
    },
    recommon (row) {
      this.$refs.table.$refs.multipleTable.toggleAllSelection() // 全选
    },
    deleteProduct (row) {

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
  &-btns {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
}
</style>
