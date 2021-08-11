import { homeStaticRoutes } from '@/router/homeRoutes.js'
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
    path: '/registerProgress',
    name: '注册进度',
    component: () => import('@/views/RegisterProgress.vue')
  },
  {
    path: '/modify-password',
    name: '修改密码',
    component: () => import('@/views/ModifyPassword.vue')
  },
  {
    path: '/notify',
    name: '消息通知',
    component: () => import('@/views/Notify.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    children: homeStaticRoutes
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
