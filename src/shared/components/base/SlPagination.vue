<template>
  <div class="pagenation">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    },
    pageIndex: {
      type: Number
    }
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100, 200],
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // // 每页查看条数变化
    handleSizeChange (val) {
      this.page.pageSize = val
      this.$emit('pageChange', this.page)
    },
    // 当前页码变化
    handleCurrentChange (val) {
      this.page.pageIndex = val
      this.$emit('pageChange', this.page)
    }
  }
}
</script>

<style scoped lang="scss">
.pagenation {
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
}
</style>
