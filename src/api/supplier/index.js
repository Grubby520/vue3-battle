import { get, post, put } from '@shared/http'
import URL from './supplierUrl'

const SUPPLIER_API = {
  getList: (params) => post(URL.list, params),
  getSupplierStatus: () => get(URL.statusList),
  frozenOrActive: (params) => put(URL.frozen, params, { addLoading: true }),
  audit: (params) => put(URL.judgeMent, params),
  access: (params) => put(URL.access, params, { addLoading: true })
}

export default SUPPLIER_API
