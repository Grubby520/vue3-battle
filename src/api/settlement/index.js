import { post } from '@shared/http'
import { objValuesHandler } from '@shared/util'
import URL from './settlementUrl'

const SETTLEMENT_API = {
  getSettlementOrderList: (params) => post(URL.settlementListUrl, objValuesHandler(params)),
  supplierConfirm: (params) => post(URL.supplierConfirmUrl, params),
  getSupplyDetails: (params) => post(URL.supplyDetailsUrl, params),
  getDeliveryInfo: (params) => post(URL.deliveryInfoUrl, params)
}

export default SETTLEMENT_API
