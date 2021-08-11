<template>
  <div class="bases">
    <div v-if="$slots.search">
      <slot name="search"></slot>
    </div>
    <template>
      <slot></slot>
      <SlBasePagination
        :total="total"
        @pageChange="pageChange"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
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
    isPagination: { type: Boolean, required: false, default: true },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50]
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    pageChange (item) {
      this.$emit('gotoPage', item.pageSize, item.pageIndex)
    },
    refresh () {
      this.$emit('gotoPage', this.pageSize, this.pageIndex)
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
