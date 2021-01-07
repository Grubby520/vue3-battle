// import { get,post } from '@shared/http'
// import URL from './goodsUrl'

const GOODS_API = {
  getPurchaseStatistics (params) {
    return Promise.resolve([
      {
        label: '全部未组单',
        value: '-1',
        extra: {
          amount: 20
        }
      },
      {
        label: '1日未组单',
        value: '2',
        extra: {
          amount: 20
        }
      }
    ])
    // return post(URL.purchaseStatistics, params).then(res => {
    //   let data = []
    //   if (res.success) {
    //     data = res.data.map(item => {
    //       return {
    //         label: item.des,
    //         value: item.dayNum,
    //         extra: {
    //           amount: item.count
    //         }
    //       }
    //     })
    //   }
    //   return data
    // })
  },
  getPurchaseTabs (params) {
    return Promise.resolve([
      {
        'index': -1,
        'name': '所有订单',
        'amount': 20,
        'value': -1
      },
      {
        'index': 3,
        'name': '当前订单时间剩余时间小于3天',
        'amount': 20,
        'value': 3
      },
      {
        'index': 1,
        'name': '当前订单时间剩余时间小于1天',
        'amount': 20,
        'value': 1
      },
      {
        'index': 30,
        'name': '近30天超时订单',
        'amount': 20,
        'value': 30
      },
      {
        'index': 7,
        'name': '近7天超时订单',
        'amount': 20,
        'value': 7
      }
    ])
    // return post(URL.purchaseTabs, params).then(res => {
    //   let data = []
    //   if (res.success) {
    //     data = res.data.map(item => {
    //       return {
    //         index: item.tabType,
    //         name: item.des,
    //         value: item.tabType,
    //         amount: item.count
    //       }
    //     })
    //   }
    //   return data
    // })
  },
  getPurchaseTableList (params) {
    return Promise.resolve([
      {
        orderId: 123123,
        dueDeliveryTime: 1610001839415,
        baseInfo: {
          supplierItemNo: '供方货号',
          merchantSku: '商家SKU',
          sku: 'SKU',
          spu: 'SPU'
        },
        orderPlan: {},
        cTime: [{
          timeStamp: '14234235324',
          type: 1,
          typeDes: '创建时间'
        },
        {
          timeStamp: '14234235324',
          type: 2,
          typeDes: '更新时间'
        }]
      }
    ])
    // return post(URL.purchaseList, params)
  },
  getDefectiveTableList (params) {
    return Promise.resolve([
      {
        'id': 1,
        'supplierItemNo': '供方货号/供应商货号',
        'supplierSkuCode': '商品SKU/供应商SKU',
        'skuCode': 'SKU/采购单上的SKU',
        'name': '商品名称/产品名称',
        'attributesName': '销售属性',
        'exceptionType': 3, // 异常类型
        'exceptionAmount': 30, // 异常数量
        'exceptionDealType': 1, // 处理方式
        'remake': '详情（备注）',
        'purchaseOrderId': '21212121', // 采购单号
        'orderNumber': '12121212', // 发货单号
        'logisticsNumber': 1, // 物流单号
        'operateName': '采购员/操作人',
        'createTime': '21212121', // 创建时间
        'updateTime': '12121212' // 更新时间
      }
    ])
    // return get(URL.defectiveList, params)
  }
}

export default GOODS_API
