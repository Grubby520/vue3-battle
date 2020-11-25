<template>
  <div id="app">
    <transition name="slide-fade">
      <router-view />
    </transition>
    <!-- icon-font symbol图标 -->
    <remote-js src="//at.alicdn.com/t/font_2214107_eremntfnql.js"></remote-js>
    <!-- 版本更新提示 -->
    <VersionUpdatePrompt></VersionUpdatePrompt>
  </div>
</template>

<script>
import RemoteJs from '@components/remoteJs/RemoteJs.js'
import VersionUpdatePrompt from '@/views/components/VersionUpdatePrompt.vue'
import { setLocalStorageItem, getLocalStorageItem } from '@shared/util'
import { get } from 'axios'

export default {
  name: 'App',
  components: {
    RemoteJs,
    VersionUpdatePrompt
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        this.getVersion()
      }, 1000 * 60 * 1)
    }
  },
  methods: {
    getVersion () {
      return get(`/version.json?version=${new Date().valueOf()}`)
        .then((res) => {
          let { data, data: { version } } = res
          if (data && version) {
            let currentVersion = getLocalStorageItem('srm-version')
            if (!currentVersion) {
              setLocalStorageItem('srm-version', version)
            }
            if (currentVersion && currentVersion !== version) {
              setLocalStorageItem('srm-version', version)
              this.$store.commit('SET_VERSION_UPDATED', true)
            }
          }
        })
    }
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
