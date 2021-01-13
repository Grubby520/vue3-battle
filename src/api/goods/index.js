
import { get, post, put } from '@shared/http'
import URL from './goodsUrl'

const GOODS_API = {
  getPurchaseStatistics (params) {
    return post(URL.purchaseStatistics, params).then(res => {
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
  getPurchaseTabs (params) {
    return post(URL.purchaseTabs, params).then(res => {
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
  },
  getPurchaseTableList (params) {
    return post(URL.purchaseList, params)
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
  },

  // 发货列表
  invoiceList (params) {
    return post(URL.invoiceList, params)
  },

  getInvoiceDetail (id) {
    return get(`${URL.invoiceDetail}/${id}`)
  },

  printNo (id) {
    return get(`${URL.printNo}/${id}`)
  },

  logisticsCompany () {
    return get(URL.logisticsCompany)
  },

  modifyLogisticsNo (data) {
    return put(URL.modifyLogisticsNo, data)
  },

  modifyInvoice (data) {
    return put(URL.modifyInvoice, data)
  },

  printInvoice (id) {
    return get(`${URL.printInvoice}/${id}`)
  }

}
export default GOODS_API
