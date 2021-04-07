
import { get, post, put } from '@shared/http'
import URL from './goodsUrl'

const GOODS_API = {
  // 获取附件列表
  remarks (params) {
    return put(URL.remarks, params)
  },
  // 获取附件列表
  getAttachmentList (params) {
    return get(URL.attachmentListUrl, params)
  },
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
  },

  getLogisticsInfo (data) {
    return get(URL.logisticsInfo, data)
  },

  batchPrintNo (data) {
    get(URL.printNo, data)
  },

  exportExcel (data) {
    return get(URL.exportExcel, data)
  },

  getSettlementOrderList (params) {
    return get(URL.settlementOrderList, params)
  },

  // 商家确认
  supplierConfirm (params) {
    return post(URL.supplierConfirm, params)
  },

  getDeliveryInfo (params) {
    return get(URL.deliveryInfo, params)
  },

  // 供货明细
  getSupplyDetails (params) {
    return get(URL.supplyDetails, params)
  },

  // 补扣款单信息
  getSupplementaryDeductionInfo (params) {
    return get(URL.supplementaryDeductionInfo, params)
  },

  getPaymentInfo (params) {
    return get(URL.paymentInfo, params)
  },

  getFinanceInfo (params) {
    return get(URL.financeInfo, params)
  },

  getSettlementOrder (params) {
    return get(URL.settlementOrder, params)
  },

  getSupplementaryDeduction (params) {
    return get(URL.supplementaryDeduction, params)
  },

  getSupplyDeductionList (params) {
    return get(URL.supplyDeductionList, params)
  },

  getReimbursementList (params) {
    return get(URL.reimbursementList, params)
  },

  updateReimbursementAttachments (params) {
    return post(URL.updateReimbursementAttachments, params)
  }

}
export default GOODS_API
