import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
export const homeRoutes = [
  {
    path: 'index',
    name: '主页',
    meta: {
      icon: 'el-icon-s-home',
      notMenu: true
    },
    component: () => import('@/views/Index.vue')
  },
  {
    path: 'myFile',
    name: '我的档案',
    meta: {
      icon: 'el-icon-postcard'
    },
    component: () => import('@/views/MyFile.vue')
  },
  {
    path: 'recommendProducts',
    name: '商品管理',
    meta: {
      icon: 'el-icon-postcard'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'list',
        name: 'OMD推品列表',
        meta: {
          icon: 'el-icon-postcard'
        },
        component: () => import('@/views/RecommendProductsList.vue')
      },
      {
        path: 'maintain',
        name: 'OMD推品',
        meta: {
          icon: 'el-icon-postcard',
          notMenu: true
        },
        props: route => { return { id: route.query.id, mode: route.query.mode } },
        component: () => import('@/views/components/recommendProducts/Maintain.vue')
      },
      {
        path: 'importSpu',
        name: '导入SPU',
        meta: {
          icon: 'el-icon-postcard'
        },
        component: () => import('@/views/ImportSpu.vue')
      },
      {
        path: 'import-product-imgs',
        name: '导入商品图片',
        meta: {
          icon: 'el-icon-postcard'
        },
        component: () => import('@/views/ImportProductImgs.vue')
      }
    ]
  },
  {
    path: 'supplierList',
    name: '供应商列表',
    meta: {
      icon: 'el-icon-more-outline'
    },
    component: () => import('@/views/SupplierList.vue')
  }
]
