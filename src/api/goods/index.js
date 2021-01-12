import { post } from '@shared/http'
import URL from './goodsUrl'

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
    return post(URL.defectiveList, params)
  },
  getGroupTabs (params) {
    return post(URL.groupTabs, params).then(res => {
      let data = []
      let tabMap = {
        3: {
          status: 'danger',
          statusText: '预警!'
        },
        5: {
          status: 'danger',
          statusText: '严重预警!'
        },
        7: {
          status: 'danger',
          statusText: '严重预警!'
        }
      }
      if (res.success) {
        data = res.data.map(item => {
          let temp = {
            index: item.tabType,
            name: item.des,
            value: item.tabType,
            amount: item.count
          }
          if (tabMap[item.tabType]) {
            temp['status'] = tabMap[item.tabType]['status']
            temp['statusText'] = tabMap[item.tabType]['statusText']
          }
          return temp
        })
      }
      return data
    })
  },
  getGroupList (params) {
    return post(URL.groupList, params)
  },
  groupSplite (params) {
    return post(URL.groupSplite, params)
  },
  groupGenerateShippedBill (params) {
    return post(URL.groupGenerateShippedBill, params)
  }
}

export default GOODS_API
