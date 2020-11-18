import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条
import { routes } from './routes'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path.includes('/home')) {
    // 根据路由生成面包屑数据
    let paths = to.matched.filter(ele => { return ele.path !== '/home' })
    let breadcrumbs = paths.map(ele => {
      return {
        path: ele.path.replace(/(?<=\/)(:\w+)(?=\/)?/, function (w) {
          return to.params[w.replace(':', '')]
        }),
        label: ele.name
      }
    })

    // 补充非菜单路由页的面包屑数据
    if (to.meta.notMenu) {
      if (from.name) {
        breadcrumbs.splice(breadcrumbs.length - 1, 0, {
          path: from.fullPath,
          label: from.name
        })
      }
    }
    store.commit('SET_BREADCRUMBS', breadcrumbs)
  }

  NProgress.start()
  next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  if (to.path.includes('/home')) {
    if (to.meta.notMenu) {
      store.commit('SET_ACTIVE_PATH', from.path)
    } else {
      store.commit('SET_ACTIVE_PATH', to.path)
    }
  }
  NProgress.done()
})

export default router
