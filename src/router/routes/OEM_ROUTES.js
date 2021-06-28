// OEM供应商菜单项
import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
import { FinanceManageRoutes } from './shared_routes'

// ODM供应商菜单项
const ROUTES = [
  {
    path: 'oem-delivery-manage',
    name: '发货管理',
    meta: {
      icon: 'icon-sl-delivery-manage',
      code: 'menu_goods_management'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'pending-order-list',
        name: '待接单列表',
        meta: {
          icon: '',
          code: 'menu_goods_management'
        },
        component: () => import('@/views/oemViews/PendingOrderList.vue')
      },
      {
        path: 'pending-delivery-list',
        name: '待发货列表',
        meta: {
          icon: '',
          code: 'menu_goods_management'
        },
        component: () => import('@/views/oemViews/PendingDeliverOrderList.vue')
      },
      {
        path: 'delivery-list',
        name: '发货单列表',
        meta: {
          icon: '',
          code: 'menu_goods_management'
        },
        component: () => import('@/views/oemViews/OemDeliveryList.vue')
      },
      {
        path: 'boxing-list',
        name: '装箱单列表',
        meta: {
          icon: '',
          code: 'menu_goods_management'
        },
        component: () => import('@/views/oemViews/BoxingList.vue')
      }
    ]
  },
  {
    path: 'oem-order-manage',
    name: '订单管理',
    meta: {
      icon: 'icon-sl-order-manage',
      code: 'menu_goods_management'
    },
    component: ParentMenuRoute,
    children: [
      {
        path: 'production-order-list',
        name: '生产订单',
        meta: {
          icon: '',
          code: 'menu_goods_management'
        },
        component: () => import('@/views/oemViews/ProductionOrderList.vue')
      },
      {
        path: 'production-order-detail',
        name: '生产订单详情',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/oemViews/productionOrderList/ProductionOrderDetail.vue')
      }
    ]
  },
  FinanceManageRoutes
]

export default ROUTES
