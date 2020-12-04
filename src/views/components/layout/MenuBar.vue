
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
      <template v-for="(item,index) in menus">
        <MenuItem
          :key="'menu-'+index"
          v-if="!item.children || item.children.length === 0"
          :menuItem="item"
        ></MenuItem>
        <Submenu :key="'submenu-'+index" v-else :submenu="item"></Submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import Submenu from './Submenu'
import MenuItem from './MenuItem'
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
      default: '#222d32'
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
    Submenu,
    MenuItem
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
  .el-menu {
    border: none;
  }
}
</style>
