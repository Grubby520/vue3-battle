export const homeRoutes = [
  {
    path: 'index',
    name: '主页',
    icon: 'el-icon-s-home',
    component: () => import('@/views/Index.vue')
  }, {
    path: 'myFile',
    name: '我的档案',
    icon: 'el-icon-postcard',
    component: () => import('@/views/MyFile.vue')
  }
]
