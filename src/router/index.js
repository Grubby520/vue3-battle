import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

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
    store.commit('SET_BREADCRUMBS', breadcrumbs)
  }

  // 全局前置守卫
  store.dispatch('OPEN_LOADING')
  next()
})

router.afterEach((to, from) => {
  if (to.path.includes('/home')) {
    store.commit('SET_ACTIVE_PATH', to.path)
  }
  // 全局后置守卫
  store.dispatch('CLOSE_LOADING')
})

export default router
