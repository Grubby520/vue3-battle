<template>
  <section class="home page-body">
    <!--侧边栏-->
    <aside class="page-aside" :class="{'page-aside--collapse':menuCollapse}">
      <SystemInfo></SystemInfo>
      <MenuBar :menus="menus" :activePath="activePath" :isCollapse="menuCollapse"></MenuBar>
    </aside>
    <article class="page-article">
      <header class="page-header clearfix">
        <span
          class="menu-collapse"
          :class="{'el-icon-s-fold':!menuCollapse,'el-icon-s-unfold':menuCollapse}"
          @click="triggerMenuCollapse"
        ></span>
        <div class="float-right mr-1rem">
          <UserInfo class="mr-1rem"></UserInfo>
          <UserOperations></UserOperations>
        </div>
      </header>
      <div class="page-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{item.label}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="page-content">
        <router-view />
      </div>
    </article>
  </section>
</template>

<script>
// @ is an alias to /src
import { createNamespacedHelpers, mapState } from 'vuex'
import SystemInfo from '@/views/components/layout/SystemInfo.vue'
import UserInfo from '@/views/components/layout/UserInfo.vue'
import UserOperations from '@/views/components/layout/UserOperations.vue'
import MenuBar from '@/views/components/layout/MenuBar.vue'
import { homeRoutes } from '@/router/homeRoutes.js'
const { mapState: userMapState, mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'Home',
  components: {
    SystemInfo,
    UserInfo,
    UserOperations,
    MenuBar
  },
  data () {
    return {
      menus: []
    }
  },
  watch: {
    permissions (val) {
      this.menus = this.getMenus(val || [])
    }
  },
  computed: {
    ...mapState(['breadcrumbs', 'activePath', 'menuCollapse']),
    ...userMapState(['permissions'])
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    getMenus (permissions) {
      let menus = []
      this.routesToMenus(homeRoutes, menus, permissions)
      return menus
    },
    routesToMenus (routes = [], menus = [], permissions, prevPath = '/home') {
      routes.forEach(route => {
        const { path, name, children, meta: { icon, notMenu, code } } = route
        if (!notMenu && code && permissions.includes(code)) {
          const curPath = `${prevPath}/${path}`
          let menu = {
            path: curPath,
            name,
            icon
          }
          menus.push(menu)
          if (children && children.length > 0) {
            menu.children = []
            this.routesToMenus(route.children, menu.children, permissions, curPath)
          }
        }
      })
    },
    triggerMenuCollapse () {
      this.$store.commit('SET_MENU_COLLAPSE', !this.menuCollapse)
    }
  },
  created () {
    this.GET_USER_INFO()
  },
  mounted () {
    this.menus = this.getMenus(this.permissions || [])
  }
}
</script>

<style lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_fn.scss';
$headerLH: pxToRem(50px);
$asideMinW: pxToRem(220px);

.block-border {
  box-sizing: border-box;
}

.page-body {
  display: flex;
  height: 100%;
  @extend .block-border;
  .page-aside {
    min-width: $asideMinW;
    background-color: $color-aside-bg;
    @extend .block-border;
    overflow: hidden;
    transition: all 100ms;
    &.page-aside--collapse {
      width: 6.4rem;
      min-width: 6.4rem;
    }
  }

  .page-article {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @extend .block-border;

    .page-header {
      height: $headerLH;
      line-height: $headerLH;
      box-sizing: border-box;
      background-color: $color-header-bg;
      .menu-collapse {
        padding-left: 0.5em;
        font-size: 2.5rem;
        color: #fff;
        cursor: pointer;
      }
    }

    .page-breadcrumb,
    .page-content {
      padding: 1em;
    }

    .page-content {
      flex: 1;
      overflow: auto;
    }

    .page-breadcrumb {
      background-color: $color-breadcrumb-bg;
    }
  }
}
</style>
