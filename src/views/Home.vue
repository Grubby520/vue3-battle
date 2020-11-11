<template>
  <div class="home">
    <!--头部-->
    <header class="page-header">
      <!-- <img alt="logo" src="../assets/logo.png"> -->
    </header>
    <section class="page-body">
      <!--侧边栏-->
      <aside class="page-aside">
      </aside>
      <!--页面内容-->
      <article class="page-content">
        <div class="page-breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view/>
      </article>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
export default {
  name: 'home',
  computed: {
    ...mapState(['breadcrumbs'])
  },
  components: {

  }
}
</script>

<style lang="scss">
  @import '@static/scss/_var.scss';
  @import '@static/scss/_fn.scss';
  $headerLH:pxToRem(50px);
  $asideMinW:pxToRem(220px);
  $headerBg:#052137;

  .block-border {
    box-sizing: border-box;
  }

  .page-header {
    height: $headerLH;
    line-height: $headerLH;
    box-sizing: border-box;
    background-color: $headerBg;
  }

  .page-body {
    display: flex;
    height: calc(100vh - #{$headerLH});
    @extend .block-border;
    .page-aside {
      flex: 1;
      min-width:$asideMinW;
      @extend .block-border;
    }

    .page-content {
      flex: 5;
      @extend .block-border;
      .page-breadcrumb {
        padding: 1em;
      }
    }
  }

</style>
