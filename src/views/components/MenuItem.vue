
<template>
  <el-menu-item :index="menuItem.path">
    <i :class="[menuItem.icon]"></i>
    <span slot="title">{{menuItem.name}}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => {
    return {

    }
  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
</style>
