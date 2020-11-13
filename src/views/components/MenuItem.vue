
<template>
  <div>
    <el-menu default-active="1-1" :collapse="isCollapse">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <span slot="title">选项4</span>
        <el-menu-item index="2-1">选项1</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {

    }
  },
  methods: {
  },
  components: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
</style>
