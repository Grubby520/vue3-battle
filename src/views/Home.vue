<template>
  <section class="home page-body">
    <!--侧边栏-->
    <aside class="page-aside">
      <MenuBar />
    </aside>
    <!--页面内容-->
    <article class="page-article">
      <!--头部-->
      <header class="page-header">
        <!-- <img alt="logo" src="../assets/logo.png"> -->
      </header>
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
import MenuBar from '@/views/components/MenuBar.vue'

export default {
  name: 'Home',
  components: {
    MenuBar
  },
  computed: {
    ...mapState(['breadcrumbs'])
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
    flex: 1;
    min-width: $asideMinW;
    max-width: $asideMinW;
    background-color: $color-aside-bg;
    @extend .block-border;
  }

  .page-article {
    height: calc(100vh - #{$headerLH});
    flex: 5;
    @extend .block-border;

    .page-header {
      height: $headerLH;
      line-height: $headerLH;
      box-sizing: border-box;
      background-color: $color-header-bg;
    }

    .page-breadcrumb {
      padding: 1em;
    }
  }
}
</style>
