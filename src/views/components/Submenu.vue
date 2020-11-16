
<template>
  <el-submenu :index="submenu.path">
    <template slot="title">
      <slot>
        <i :class="[submenu.icon]"></i>
        <span slot="title">{{submenu.name}}</span>
      </slot>
    </template>
    <template v-for="(submenuItem,index) in submenu.children">
      <MenuItem
        :key="'menu-'+index"
        v-if="!submenuItem.children || submenuItem.children.length === 0"
        :menuItem="submenuItem"
      ></MenuItem>
      <Submenu :key="'submenu-'+index" v-else :submenu="submenuItem"></Submenu>
    </template>
  </el-submenu>
</template>

<script>
import MenuItem from './MenuItem'
export default {
  name: 'Submenu',
  props: {
    submenu: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    MenuItem
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
