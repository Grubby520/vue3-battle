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
          icon: 'el-icon-paperclip',
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
        path: 'odmOneDetails',
        name: '创建产品',
        meta: {
          icon: 'el-icon-paperclip',
          code: 'menu_create_product'
        },
        props: route => {
          return {
            id: route.query.id,
            mode: route.query.mode,
            categoryId: route.query.categoryId
          }
        },
        component: () => import('@/views/components/recommendProducts/OdmOneDetails.vue')
      },
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
        name: '报账单列表',
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
        path: 'settlement-bill-detail',
        name: '报账单详情',
        meta: {
          icon: '',
          notMenu: true
        },
        component: () => import('@/views/settlementBillList/SettlementBillDetail.vue')
      }
    ]
  }
]
