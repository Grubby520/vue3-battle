<template>
  <section class="home page-body">
    <!--侧边栏-->
    <aside class="page-aside" :class="{'page-aside--collapse':menuCollapse}">
      <SystemInfo></SystemInfo>
      <MenuBar :menus="menus" :activePath="activePath" :isCollapse="menuCollapse"></MenuBar>
    </aside>
    <article class="page-article">
      <header class="page-header clearfix">
        <div class="page-breadcrumb">
          <el-breadcrumb>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
              <SlSvgIcon
                v-if="index === 0"
                :iconClass="pathIconMap[item.path]+'-active'"
                class="mr-8px"
              ></SlSvgIcon>
              {{item.label}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="float-right mr-1rem align-middle--in-transform">
          <UserInfo></UserInfo>
        </div>
      </header>
      <div class="page-content">
        <router-view />
      </div>
    </article>
  </section>
</template>

<script>
// @ is an alias to /src
import gwm from 'gwm'
import { createNamespacedHelpers, mapState } from 'vuex'
import SystemInfo from '@/views/components/layout/SystemInfo.vue'
import UserInfo from '@/views/components/layout/UserInfo.vue'
import MenuBar from '@/views/components/layout/MenuBar.vue'
const { mapState: userMapState, mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'Home',
  components: {
    SystemInfo,
    UserInfo,
    MenuBar
  },
  data () {
    return {
      menus: [],
      pathIconMap: {}
    }
  },
  watch: {
    permissions () {
      this.setMenus()
    }
  },
  computed: {
    ...mapState(['breadcrumbs', 'activePath', 'menuCollapse']),
    ...userMapState(['permissions', 'routes'])
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    setMenus () {
      let menus = []
      this.pathIconMap = {}
      this.routesToMenus(this.routes || [], menus, this.permissions || [])
      this.menus = menus
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
          this.pathIconMap[menu.path] = menu.icon // 存储路由path和对应icon图标的映射
          menus.push(menu)
          if (children && children.length > 0) {
            menu.children = []
            this.routesToMenus(route.children, menu.children, permissions, curPath)
          }
        }
      })
    },
    setWatermark () {
      const domainNames = {
        'srm-web.dev.erp.starlinke.tech': 'dev',
        'srm-web.hotfix.erp.starlinke.tech': 'hotfix',
        'srm-web.qa.erp.starlinke.tech': 'qa',
        'srm-web.qa2.erp.starlinke.tech': 'qa2',
        'srm-web.qa3.erp.starlinke.tech': 'qa3',
        'srm-web.qa4.erp.starlinke.tech': 'qa4',
        'srm-web.qa5.erp.starlinke.tech': 'qa5',
        'alpha.srm.starlinke.cn': 'alpha',
        'beta.srm.starlinke.cn': 'beta'
      }
      const dev = domainNames[window.location.hostname]
      if (dev) {
        gwm.creation({
          container: '.page-aside',
          txt: `${dev}环境`,
          width: 100,
          height: 100,
          fontSize: 18,
          color: '#fff',
          css: {
            'z-index': '10000',
            'pointer-events': 'none'
          }
        })
      }
    }
  },
  created () {
    this.GET_USER_INFO()
  },
  mounted () {
    this.setMenus()
    // 导航栏根据环境设置不同的水印
    this.setWatermark()
  }
}
</script>

<style lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_fn.scss';
$headerLH: pxToRem(64px);
$asideMinW: pxToRem(240px);

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
      border-bottom: 1px solid $color-main-bg;
      background-color: $color-header-bg;
      .menu-collapse {
        padding-left: 0.5em;
        font-size: 2.5rem;
        color: $color-white;
        cursor: pointer;
      }
    }

    .page-content {
      flex: 1;
      padding: 2rem 4rem 1rem;
      background-color: $color-main-bg;
      overflow: auto;
    }

    .page-breadcrumb {
      display: inline-block;
      padding-left: 4rem;
      box-sizing: border-box;
      .el-breadcrumb {
        font-size: 1.8rem;
      }
    }
  }
}
</style>
