
<template>
  <div>
    <template v-for="menu in submenus">
      <el-submenu
        v-if="menu.children && menu.children.length > 0"
        :index="menu.path"
        :key="menu.path"
      >
        <template slot="title">
          <SlSvgIcon v-if="isSvgIcon(menu.icon)" :iconClass="menu.icon" class="mr-1rem"></SlSvgIcon>
          <i v-else :class="[menu.icon]"></i>
          <span slot="title">{{menu.name}}</span>
        </template>
        <Submenu :submenus="menu.children"></Submenu>
      </el-submenu>
      <MenuItem v-else :menuItem="menu" :key="menu.path"></MenuItem>
    </template>
  </div>
</template>

<script>
import MenuItem from './MenuItem'
export default {
  name: 'Submenu',
  props: {
    submenus: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MenuItem
  },
  computed: {
    isSvgIcon () {
      return function (iconClass) {
        return iconClass.includes('icon-sl-')
      }
    }
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
</style>
