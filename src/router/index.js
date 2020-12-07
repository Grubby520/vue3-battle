import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条
import { routes } from './routes'
import store from '../store'
import { getLocalStorageItem, getCookie } from '@shared/util'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 白名单路由,不登录就可以访问
  let whiteRoutes = ['/login', '/register', '/notify']
  const HAS_TOKEN = getCookie('token')
  const IS_WHITE_ROUTE = whiteRoutes.some(path => to.path.indexOf(path) !== -1)

  if (!HAS_TOKEN) {
    NProgress.start()
    if (IS_WHITE_ROUTE) {
      next()
    } else {
      next('/login')
    }
    return
  }

  if (to.path.includes('/home')) {
    // 根据路由生成面包屑数据
    let paths = to.matched.filter(ele => { return ele.path !== '/home' })
    let breadcrumbs = paths.map(ele => {
      return {
        path: ele.path.replace(/(?<=\/)(:\w+)(?=\/)?/, function (w) {
          return to.params[w.replace(':', '')]
        }),
        label: ele.meta.alias ? ele.meta.alias : ele.name
      }
    })
    store.commit('SET_BREADCRUMBS', breadcrumbs)
  }

  NProgress.start()
  next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  if (to.path.includes('/home')) {
    if (to.meta.notMenu) {
      store.commit('SET_ACTIVE_PATH', store.state.activePath || getLocalStorageItem('activePath'))
    } else {
      store.commit('SET_ACTIVE_PATH', to.path)
    }
  }
  NProgress.done()
})

export default router
