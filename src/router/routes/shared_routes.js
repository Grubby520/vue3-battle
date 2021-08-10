import ParentMenuRoute from '@/views/components/layout/ParentMenuRoute.vue'

export let FinanceManageRoutes = {
  path: 'finance',
  name: '财务管理',
  meta: {
    icon: 'icon-sl-finance-manage',
    code: 'menu_goods_management'
  },
  component: ParentMenuRoute,
  children: [
    {
      path: 'settlement-order-list',
      name: '结算单列表',
      meta: {
        icon: '',
        code: 'menu_goods_management'
      },
      component: () => import('@/views/commonViews/SettlementOrderList.vue')
    },
    {
      path: 'settlement-order-detail',
      name: '结算单详情',
      meta: {
        icon: '',
        notMenu: true
      },
      component: () => import('@/views/commonViews/settlementOrderList/SettlementOrderDetail.vue')
    },
    {
      path: 'bill-list',
      name: '请款单列表',
      meta: {
        icon: '',
        code: 'menu_goods_management'
      },
      component: () => import('@/views/commonViews/BillList.vue')
    },
    {
      path: 'bill-detail',
      name: '请款单详情',
      meta: {
        icon: '',
        notMenu: true
      },
      component: () => import('@/views/commonViews/billList/BillDetail.vue')
    }
  ]
}
