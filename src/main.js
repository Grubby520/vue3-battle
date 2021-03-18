import '@assets/scss/common.scss'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'// Progress 进度条 样式
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/lang'
import '@shared/components/elementUI.js'
import '@shared/components/register.js'
import '@shared/directives/register.js'
import '@shared/filters/register.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
