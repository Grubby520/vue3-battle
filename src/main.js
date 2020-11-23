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
// 时间插件
import moment from 'moment'
Vue.prototype.$moment = moment
moment.locale('zh-cn')

// if (process.env.NODE_ENV === 'development') {
//   require('@/mock')
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
