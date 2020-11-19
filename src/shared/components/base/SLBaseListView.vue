<template>
  <div class="bases">
    <div v-if="$slots.search">
      <slot name="search"></slot>
      <div class="bases-search">
        <el-button type="primary" @click="searchPage">搜索</el-button>
        <el-button v-if="isReset" @click="reset">重置</el-button>
      </div>
    </div>
    <template>
      <slot></slot>
      <SlBasePagination
        :total="total"
        @pageChange="pageChange"
        :pageIndex="pageIndex"
        v-if="isPagination"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'SlBaseListView',
  props: {
    total: { type: Number, required: false, default: undefined },
    pageIndex: { type: Number, required: false, default: undefined },
    isReset: { type: Boolean, required: false, default: true },
    isPagination: { type: Boolean, required: false, default: true }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    pageChange (item) {
      this.$emit('gotoPage', item.pageSize, item.pageIndex)
    },
    searchPage () {
      this.$emit('gotoPage', 10, 1)
    },
    refresh () {
      this.$emit('gotoPage', 10, 1)
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
.bases {
  &-search {
    text-align: right;
    font-size: 12px;
    padding: 5px;
    margin-top: 20px;
  }
  &-page {
    margin-bottom: 20px;
    margin-top: 5px;
    text-align: center;
  }
}
</style>
