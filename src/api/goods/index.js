// import { post } from '@shared/http'
// import URL from './goodsUrl'

const PURCHASELIST_API = {
  getStatistics (params) {
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
    // return post(URL.statistics, params).then(res => {
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
  getTabs (params) {
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
    // return post(URL.tabs, params).then(res => {
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
  }
}

export default PURCHASELIST_API
