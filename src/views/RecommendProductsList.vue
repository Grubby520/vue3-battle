<template>
  <div class="recommond">
    <SlBaseListView
      @gotoPage="gotoPage"
      @reset="reset"
      :total="total"
      :pageIndex="pageIndex"
      class="recommonPar"
      ref="listView"
    >
      <div slot="search">
        <SlSearchForm v-model="query" :items="searchItems" />
      </div>
      <el-divider />
      <div class="recommond-btns">
        <el-button type="primary" @click="recommon">批量推品</el-button>
        <el-button type="primary">导入SPU</el-button>
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
// import recommond from '@api/recommendProducts/recommendProducts.js'
export default {
  data () {
    return {
      recommonPar: {},
      tableData: [],
      selections: [],
      pageIndex: 1, // 页数
      total: 0, // 总页数
      pageSize: 10,
      searchPar: {},
      query: {
        productName: '',
        size: '',
        status: ''
      },
      searchItems: [
        { type: 'input', label: '品类', name: 'productName' },
        { type: 'input', label: '供方货号', name: 'size' },
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
          prop: 'product',
          label: '商品信息',
          width: '300',
          isInImg: 'imageSrc',
          pre: {
            id: 'PID',
            productName: '平台PID',
            productVariantId: '店铺'
          }
        },
        {
          prop: 'productName',
          label: '品类'
        },
        {
          prop: 'skuCode',
          label: '商店'
        },
        {
          prop: 'skuCode',
          label: '供货价（元）'
        },
        {
          prop: 'skuCode',
          label: '状态'
        },
        {
          prop: 'skuCode',
          label: '询盘意见'
        },
        {
          prop: 'skuCode',
          label: '创建时间/更新时间',
          pre: {
            startTime: '创建',
            creatTime: '更新'
          }
        }
      ]
    }
  },

  methods: {
    gotoPage (pageSize, pageIndex) {
      this.recommonPar = { ...this.searchPar, pageIndex, pageSize }
      // recommond.getList({ ...this.recommonPar })
      //   .then((res) => {
      //   const { list, pageNum, pageSize, total } = res.data
      // this.tableData = list
      this.tableData = [
        {
          date: '2016-05-04',
          name: '王小虎',
          storeName: 'ffeersd',
          img: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          skuCode: '上海市普陀区江路 1517 弄',
          url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          startTime: '2020-11-16',
          creatTime: '2020-11-18'
        }
      ]
      // this.total = total
      // })
      // .catch(() => {
      //   this.showLoad = false
      // })
    },
    handleSelectionChange (val) {
      this.selections = val
      console.log(val)
    },
    reset () {
      this.query.productName = ''
      this.query.size = ''
      this.query.status = ''
      // Object.assign(this.query, {})
    },
    maintain (row, status) {
      this.$router.push({ path: '/home/recommend-products/maintain', query: { mode: status } })
    },
    recommon (row) {
      this.$refs.table.$refs.multipleTable.toggleAllSelection() // 全选
    },
    deleteProduct (row) {

    },
    uploadImages () {
      this.$router.push({ path: '/home/recommend-products/import-product-imgs' })
    },
    valChange (val) {
      console.log(val)
      this.searchPar = val
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
