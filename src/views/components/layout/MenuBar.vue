
<template>
  <div class="menu-bar">
    <el-menu
      :router="true"
      :default-active="activePath"
      :collapse="isCollapse"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
    >
      <Submenu :submenus="menus"></Submenu>
    </el-menu>
  </div>
</template>

<script>
import Submenu from './Submenu'

export default {
  name: 'MenuBar',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    activePath: {
      type: String,
      default: null
    },
    menus: {
      type: Array,
      default: () => ([])
    },
    backgroundColor: {
      type: String,
      default: '#1a233b'
    },
    textColor: {
      type: String,
      default: '#8aa4af'
    },
    activeTextColor: {
      type: String,
      default: '#fff'
    }
  },
  components: {
    Submenu
  },
  data () {
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
.menu-bar {
  height: calc(100% - 5rem);
  overflow-y: auto;
  margin-bottom: 2rem;
  &::-webkit-scrollbar {
    display: none;
  }
}
.menu-bar /deep/ {
  .el-menu {
    border: none;
  }
  // 以下样式处理 element菜单报 Maximum call stack size exceeded错的折中处理
  .el-menu--collapse > div > .el-submenu > .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .el-menu--collapse
    > div
    > .el-submenu
    > .el-submenu__title
    .el-submenu__icon-arrow {
    display: none;
  }
}
</style>
