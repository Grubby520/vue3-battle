<template>
  <div class="bases">
    <div slot="top" v-if="$slots.criteria">
      <slot name="criteria" />
      <div class="bases-search">
        <el-button v-if="$slots.criteria" type="primary" size="mini" @click="search">搜索</el-button>
        <el-button v-if="$slots.criteria && isRest" size="mini" @click="reset">重置</el-button>
      </div>
    </div>
    <div v-if="pagination.total > 0">
      <slot>表格区域</slot>
      <div class="bases-page" v-if="isPagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="refresh"
          :current-page.sync="pagination.pageIndex"
          :page-sizes="pageSizes"
          :page-size="pagination.pageSize"
          layout="sizes, total, prev, pager, next, jumper"
          background
          :total="pagination.total"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlBaseListView',
  props: {
    criteria: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    height: { type: Number, required: false, default: undefined },
    isPagination: { type: Boolean, required: false, default: true },
    isRest: { type: Boolean, required: false, default: true }
  },
  data () {
    return {
      showSearchCriteria: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      pageSizes: [10, 20, 30, 50],
      loading: false
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    updatePagination (page) {
      // 更新页码
      this.pagination.pageIndex = page.pageIndex
      this.pagination.pageSize = page.pageSize
      this.pagination.total = page.total
      // this.loading = false
    },
    handleSizeChange (val) {
      // 改变pageSize
      this.pagination.pageSize = val
      // this.loading = true
      this.$emit(
        'goto-page',
        1,
        this.pagination.pageSize,
        this.updatePagination
      )
    },
    search () {
      // 搜索
      // this.loading = true
      this.$emit(
        'goto-page',
        1,
        this.pagination.pageSize,
        this.updatePagination
      )
    },
    refresh () {
      // if (!this.loading) {
      // this.loading = true
      this.$emit(
        'goto-page',
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.updatePagination
      )
      // }
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
.bases {
  padding: 20px;
  &-search {
    text-align: right;
    font-size: 12px;
    padding: 5px;
  }
  &-page {
    margin-bottom: 20px;
    margin-top: 5px;
    text-align: center;
  }
  /deep/.el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    color: #000;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  /deep/.el-pagination {
    font-weight: unset;
  }
  /deep/.el-pagination__total {
    color: #000;
  }
}
</style>
