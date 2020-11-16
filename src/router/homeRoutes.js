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
  }, {
    path: 'recommendProducts',
    name: '商品管理',
    icon: 'el-icon-postcard',
    component: () => import('@/views/components/recommendProducts/List.vue')
    // children: [
    //   {
    //     path: 'maintain',
    //     name: '商品管理',
    //     icon: 'el-icon-postcard',
    //     component: () => import('@/views/components/recommendProducts/Maintain.vue')
    //   }
    // ]
  },
  {
    path: 'maintain',
    name: 'ODM推品',
    icon: 'el-icon-postcard',
    component: () => import('@/views/components/recommendProducts/Maintain.vue')
  }
]
