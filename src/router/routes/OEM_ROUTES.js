// OEM供应商菜单项
import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'
// ODM供应商菜单项
const ROUTES = [
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
        path: 'stay-orders-list',
        name: '待结单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/StayGroupedGoods.vue')
      },
      {
        path: 'delivery-list',
        name: '发货单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/DeliveryList.vue')
      },
      {
        path: 'purchase-list',
        name: '采购单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/PurchaseList.vue')
      },
      {
        path: 'defective-list',
        name: '次品列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_odm_upload_list'
        },
        component: () => import('@/views/DefectiveList.vue')
      },
      {
        path: 'less-goods-list',
        name: '缺货列表',
        meta: {
          icon: 'el-icon-paperclip',
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
          icon: 'el-icon-paperclip',
          code: 'menu_my_info'
        },
        component: () => import('@/views/Bank.vue')
      },
      {
        path: 'settlement-order-list',
        name: '结算单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_my_info'
        },
        component: () => import('@/views/SettlementOrderList.vue')
      },
      {
        path: 'settlement-order-detail',
        name: '结算单详情',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/settlementOrderList/SettlementOrderDetail.vue')
      },
      {
        path: 'bill-list',
        name: '请款单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_my_info'
        },
        component: () => import('@/views/BillList.vue')
      },
      {
        path: 'supply-deduct-money-list',
        name: '补扣款单列表',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_my_info'
        },
        component: () => import('@/views/SupplyDeductMoneyList.vue')
      },
      {
        path: 'bill-detail',
        name: '请款单详情',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/billList/BillDetail.vue')
      }
    ]
  }
]

export default ROUTES
