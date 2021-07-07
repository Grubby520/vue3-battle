import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
import { FinanceManageRoutes } from './shared_routes'

// ODM供应商菜单项
const ROUTES = [
  {
    path: 'basic',
    name: '基础资料',
    meta: {
      icon: 'el-icon-folder',
      code: 'menu_my_info'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'my-file',
        name: '基础资料',
        meta: {
          icon: '',
          code: 'menu_my_info'
        },
        component: () => import('@/views/MyFile.vue')
      }
    ]
  },
  {
    path: 'recommend-products',
    name: '商品管理',
    meta: {
      icon: 'el-icon-goods',
      code: 'menu_goods_management'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'goods-statistics',
        name: '商品数据',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/GoodsStatistics.vue')
      },
      {
        path: 'list',
        name: '商品列表',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/RecommendProductsList.vue')
      },
      {
        path: 'category',
        name: '创建产品',
        meta: {
          icon: '',
          code: 'menu_create_product'
        },
        component: () => import('@/views/product/Category.vue')
      },
      {
        path: 'productDetail',
        name: '产品详情',
        meta: {
          alias: '创建产品',
          icon: '',
          notMenu: false
        },
        props: route => {
          return {
            id: route.query.id,
            mode: route.query.mode,
            categoryId: route.query.categoryId,
            cateLabels: route.query.cateLabels,
            categoryPath: route.query.categoryPath,
            supplierItemNo: route.query.supplierItemNo
          }
        },
        component: () => import('@/views/product/productDetail/Index.vue')
      }
    ]
  },
  {
    path: 'delivery-manage',
    name: '发货管理',
    meta: {
      icon: 'el-icon-box',
      code: 'menu_goods_management'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'stay-grouped-goods',
        name: '待组单商品',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/StayGroupedGoods.vue')
      },
      {
        path: 'delivery-list',
        name: '发货单列表',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/DeliveryList.vue')
      },
      {
        path: 'purchase-list',
        name: '采购单列表',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/PurchaseList.vue')
      },
      {
        path: 'defective-list',
        name: '次品列表',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/DefectiveList.vue')
      },
      {
        path: 'less-goods-list',
        name: '缺货列表',
        meta: {
          icon: '',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/LessGoodsList.vue')
      }
    ]
  },
  {
    path: 'finance',
    name: '财务管理',
    meta: {
      icon: 'el-icon-bank-card',
      code: 'menu_my_info'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'bank',
        name: '收款信息',
        meta: {
          icon: '',
          code: 'menu_my_info'
        },
        component: () => import('@/views/Bank.vue')
      },
      ...FinanceManageRoutes.children
    ]
  }
]

export default ROUTES
