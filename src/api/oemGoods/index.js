
import { get, post, put } from '@shared/http'
import URL from './oemGoodsUrl'

const OEM_GOODS_API = {
  getPurchaseOrderList (params) {
    return post(URL.purchaseOrderListUrl, params)
  },
  receiveOrder (params) {
    return put(URL.receiveOrderUrl, params)
  },
  getPendingDeliverStatic (params) {
    return post(URL.pendingDeliverStaticUrl, params)
  },
  getDeliveryConfirmList (params) {
    return post(URL.deliveryConfirmListUrl, params)
  },
  getLogisticsCompany (params) {
    return get(URL.logisticsCompanyUrl, params)
  },
  doDelivery (params) {
    return post(URL.deliveryUrl, params)
  },
  getDeliveryList (params) {
    return post(URL.deliveryListUrl, params)
  },
  // 获取单个批次号
  genPreInvoiceBatchNo (id) {
    return get(URL.genPreInvoiceBatchNoUrl + `/${id}`, {})
  },
  genDeliverDetailInfo (id) {
    return get(URL.deliverDetailUrl + `/${id}`, {})
  },
  genDeliverPrintInfo (id) {
    return get(URL.deliverPrintUrl + `/${id}`, {})
  },
  genLogisticsInfo (params) {
    return get(URL.logisticsInformationUrl, params)
  },
  getDeliveryPackageList (params) {
    return post(URL.deliveryPackageListUrl, params)
  },
  getDeliveryPackageItem (params) {
    return post(URL.deliveryPackageItemUrl, params)
  },
  getDeliveryPackagePrintInfo (params) {
    return post(URL.deliveryPackagePrintUrl, params)
  },
  // 生产订单列表
  getProductionOrderList (params) {
    return post(URL.productionOrderListUrl, params)
  },
  // 生产订单列表统计
  getProductionOrderStatic (params) {
    return post(URL.productionOrderStaticUrl, params)
  },
  // 生产订单详情
  getProductionOrderDetail (params) {
    return post(URL.purchaseOrderDetailUrl, params)
  }
}
export default OEM_GOODS_API
