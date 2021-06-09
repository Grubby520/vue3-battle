
import { post, put } from '@shared/http'
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
  }

}
export default OEM_GOODS_API
