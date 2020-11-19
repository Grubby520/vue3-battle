<template>
  <div id="app">
    <transition name="slide-fade">
      <router-view />
    </transition>
    <remote-js src="//at.alicdn.com/t/font_2214107_eremntfnql.js"></remote-js>
  </div>
</template>

<script>
import RemoteJs from '@components/remoteJs/RemoteJs.js'

export default {
  name: 'App',
  components: {
    RemoteJs
  }
}
</script>

<style lang="scss">
html {
  font-size: 10px; //设为10,方便计算rem
}

html,
body {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px; // 设计稿主字体大小
  height: 100%;
}
</style>
