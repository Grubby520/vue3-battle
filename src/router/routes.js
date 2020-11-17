import { homeRoutes } from '@/router/homeRoutes.js'
export const routes = [
  {
    path: '/(login)?',
    name: '登录',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: '注册',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    children: homeRoutes
  },
  {
    path: '/doc',
    name: '文档',
    component: () => import('@/views/Doc.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/Doc.vue')
  },
  {
    path: '*',
    component: () => import('@/views/errors/404.vue')
  }
]
