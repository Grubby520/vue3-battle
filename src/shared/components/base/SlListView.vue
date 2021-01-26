<template>
  <div class="bases">
    <div v-if="$slots.search">
      <slot name="search"></slot>
      <div class="bases-search">
        <el-button type="primary" @click="searchPage" :loading="loading">搜索</el-button>
        <el-button v-if="isReset" @click="reset">重置</el-button>
      </div>
    </div>
    <template>
      <slot></slot>
      <SlBasePagination
        :total="total"
        @pageChange="pageChange"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        v-if="isPagination"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'SlListView',
  props: {
    total: { type: Number, required: false, default: undefined },
    pageIndex: { type: Number, required: false, default: undefined },
    pageSize: { type: Number, required: false, default: 10 },
    isReset: { type: Boolean, required: false, default: true },
    isPagination: { type: Boolean, required: false, default: true }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    pageChange (item) {
      this.$emit('gotoPage', item.pageSize, item.pageIndex)
    },
    searchPage () {
      this.loading = true
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
  }
}
</style>
