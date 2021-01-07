import { post } from '@shared/http'
import URL from './goodsUrl'

const PURCHASELIST_API = {
  getStatistics (params) {
    return post(URL.statistics, params).then(res => {
      let data = []
      if (res.success) {
        data = res.data.map(item => {
          return {
            label: item.des,
            value: item.dayNum,
            extra: {
              amount: item.count
            }
          }
        })
      }
      return data
    })
  },
  getTabs (params) {
    return post(URL.tabs, params).then(res => {
      let data = []
      if (res.success) {
        data = res.data.map(item => {
          return {
            index: item.tabType,
            name: item.des,
            value: item.tabType,
            amount: item.count
          }
        })
      }
      return data
    })
  }
}

export default PURCHASELIST_API
