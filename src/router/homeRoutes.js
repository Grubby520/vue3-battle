import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
// meta.code用于菜单权限控制
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
  // {
  //   path: 'my-file',
  //   name: '我的档案',
  //   meta: {
  //     icon: 'el-icon-postcard',
  //     code: 'menu_my_info'
  //   },
  //   component: () => import('@/views/MyFile.vue')
  // },
  {
    path: 'recommend-products',
    name: '商品管理',
    meta: {
      icon: 'el-icon-goods',
      code: 'menu_goods_management'
    },
    component: ParentMenuRoute,
    children: [
      // {
      //   path: 'odmOneDetails',
      //   name: '创建产品',
      //   meta: {
      //     icon: 'el-icon-paperclip',
      //     code: 'menu_create_product'
      //   },
      //   props: route => {
      //     return {
      //       id: route.query.id,
      //       mode: route.query.mode,
      //       categoryId: route.query.categoryId
      //     }
      //   },
      //   component: () => import('@/views/components/recommendProducts/OdmOneDetails.vue')
      // },
      {
        path: 'list',
        name: '商品列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/RecommendProductsList.vue')
      },
      {
        path: 'odmDetail',
        name: '产品详情',
        meta: {
          alias: '创建产品',
          icon: '',
          notMenu: true
        },
        props: route => {
          return {
            id: route.query.id,
            mode: route.query.mode,
            categoryId: route.query.categoryId,
            cateLabels: route.query.cateLabels,
            categoryLevel: route.query.categoryLevel,
            supplierItemNo: route.query.supplierItemNo
          }
        },
        component: () => import('@/views/components/recommendProducts/OdmDetail.vue')
      },
      {
        path: 'import-spu',
        name: '导入SPU',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/ImportSpu.vue')
      },
      {
        path: 'import-product-imgs',
        name: '导入商品图片',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/ImportProductImgs')
      }
    ]
  }
]
