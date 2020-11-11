import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import store from '../store'
import i18n from '@/lang'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (Array.isArray(to.matched)) {
    // 根据路由生成面包屑数据及国际化
    store.commit('setBreadcrumbs', to.matched.filter(ele => { return ele.path !== '/home/' }).map(ele => {
      return {
        path: ele.path.replace(/(?<=\/)(:\w+)(?=\/)?/, function (w) {
          return to.params[w.replace(':', '')]
        }),
        label: (function () {
          if (ele.path.lastIndexOf(':') === -1) {
            return i18n.t('home.routers.' + ele.path.slice(1).replace('/', '_'))
          }
          return to.params[ele.path.slice(ele.path.search(/(?<=\/)(:\w+)$/) + 1)]
        })()
      }
    }))
  }

  // 全局前置守卫
  store.dispatch('createLoading')
  next()
})

router.afterEach((to, from) => {
  // 全局后置守卫
  store.dispatch('closeLoading')
})

export default router
