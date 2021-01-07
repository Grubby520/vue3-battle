import { get } from '@shared/http'
import URL from './goodsUrl'

const PURCHASELIST_API = {
  getStatistics (params) {
    return get(URL.statistics, params).then(res => {
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
  }
}

export default PURCHASELIST_API
