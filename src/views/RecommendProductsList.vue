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
      <div slot="search" class="flex-center">
        <div class="flex-left searchUnit">
          <span class="recommond-label">品类</span>
          <el-input
            class="recommond-input"
            v-model.trim="recommonPar.productName"
            clearable
            placeholder="请输入学科"
          />
        </div>
        <div class="flex-left searchUnit">
          <span class="recommond-label">供方货号</span>
          <el-input
            class="recommond-input"
            v-model.trim="recommonPar.productName"
            clearable
            placeholder="请输入供方货号"
          />
        </div>
        <div class="flex-left searchUnit">
          <span class="recommond-label">状态</span>
          <el-select v-model="recommonPar.productName" class="recommond-input">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
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
        <div slot="opration" slot-scope="props">
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
      ],
      status: [
        { 'value': 1, 'label': '待推品' },
        { 'value': 2, 'label': '已推品' },
        { 'value': 3, 'label': '被选品' },
        { 'value': 4, 'label': '询盘中' }
      ]
    }
  },

  methods: {
    gotoPage (pageSize, pageIndex) {
      console.log('2')
      // this.recommonPar.pageIndex = pageIndex
      // this.recommonPar.pageSize = pageSize
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
    reset () { },
    maintain (row, status) {
      this.$router.push({ path: '/home/recommendProducts/maintain', query: { mode: status } })
    },
    recommon (row) {
      this.$refs.table.$refs.multipleTable.toggleAllSelection() // 全选
    },
    deleteProduct (row) {

    },
    uploadImages () {
      this.$router.push({ path: '/home/recommendProducts/uploadImages' })
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
  .searchUnit {
    width: 30%;
  }
  &-label {
    white-space: nowrap; /*强制span不换行*/
    display: inline-block; /*将span当做块级元素对待*/
  }
  &-input {
    margin-left: 20px;
    margin-right: 20px;
    width: 100%;
  }
}
</style>
