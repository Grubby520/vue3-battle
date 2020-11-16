<template>
  <section class="home page-body">
    <!--侧边栏-->
    <aside class="page-aside">
      <SystemInfo></SystemInfo>
      <UserStatus></UserStatus>
      <MenuBar :menus="menus" :activePath="activePath"></MenuBar>
    </aside>
    <article class="page-article">
      <header class="page-header"></header>
      <div class="page-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbs"
            :key="index"
            :to="{ path: item.path }"
          >{{item.label}}</el-breadcrumb-item>
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
import { mapState } from 'vuex'
import SystemInfo from '@/views/components/SystemInfo.vue'
import UserStatus from '@/views/components/UserStatus.vue'
import MenuBar from '@/views/components/MenuBar.vue'
import { homeRoutes } from '@/router/homeRoutes.js'

export default {
  name: 'Home',
  components: {
    SystemInfo,
    UserStatus,
    MenuBar
  },
  data () {
    return {
      menus: []
    }
  },
  computed: {
    ...mapState(['breadcrumbs', 'activePath'])
  },
  methods: {
    getMenus () {
      let menus = []
      this.routesToMenus(homeRoutes, menus)
      return menus
    },
    routesToMenus (routes = [], menus = [], prevPath = '/home') {
      routes.forEach(route => {
        const { path, name, icon, children } = route
        const curPath = `${prevPath}/${path}`
        let menu = {
          path: curPath,
          name,
          icon
        }
        menus.push(menu)
        if (children && children.length > 0) {
          menu.children = []
          this.routesToMenus(route.children, menu.children, curPath)
        }
      })
      return this.menus
    }
  },
  mounted () {
    this.menus = this.getMenus()
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
  }

  .page-article {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    @extend .block-border;

    .page-header {
      height: $headerLH;
      line-height: $headerLH;
      box-sizing: border-box;
      background-color: $color-header-bg;
    }

    .page-breadcrumb,
    .page-content {
      padding: 1em;
    }

    .page-content {
      flex: 1;
      overflow: auto;
    }
  }
}
</style>
