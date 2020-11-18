import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
export const homeRoutes = [
  {
    path: 'index',
    name: '主页',
    icon: 'el-icon-s-home',
    notMenu: true,
    component: () => import('@/views/Index.vue')
  },
  {
    path: 'myFile',
    name: '我的档案',
    icon: 'el-icon-postcard',
    component: () => import('@/views/MyFile.vue')
  },
  {
    path: 'recommendProducts',
    name: '商品管理',
    icon: 'el-icon-postcard',
    component: ParentMenuRoute,
    children: [
      {
        path: 'list',
        name: 'OMD推品列表',
        icon: 'el-icon-postcard',
        component: () => import('@/views/RecommendProductsList.vue')
      },
      {
        path: 'maintain',
        name: 'OMD推品',
        notMenu: true,
        props: route => { return { id: route.query.id, mode: route.query.mode } },
        icon: 'el-icon-postcard',
        component: () => import('@/views/components/recommendProducts/Maintain.vue')
      },
      {
        path: 'importSpu',
        name: '导入SPU',
        icon: 'el-icon-postcard',
        component: () => import('@/views/ImportSpu.vue')
      }
    ]
  }
]
