import { get, post } from '@shared/http'
import { objValuesHandler } from '@shared/util'
import URL from './settlementUrl'

const SETTLEMENT_API = {
  getSettlementOrderList: (params) => post(URL.settlementListUrl, objValuesHandler(params)),
  supplierConfirm: (params) => post(URL.supplierConfirmUrl, params),
  getSupplyDetails: (params) => post(URL.supplyDetailsUrl, params),
  getDeliveryInfo: (params) => post(URL.deliveryInfoUrl, params),
  getPaymentOrderList: (params) => get(URL.paymentOrderListUrl, params),
  getPaymentOrderDetail: (id) => get(`${URL.paymentOrderDetailUrl}/${id}`),
  getSettlementOrderInfo: (params) => get(URL.settlementOrderInfoUrl, params),
  getSupplementaryDeductionInfo: (params) => get(URL.supplementaryDeductionInfoUrl, params)
}

export default SETTLEMENT_API
