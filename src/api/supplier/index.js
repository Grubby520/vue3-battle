import { get, post } from '@shared/http'
import URL from './supplierUrl'

const SUPPLIER_API = {
  getList: (params) => post(URL.list, params),
  getSupplierStatus: () => get(URL.statusList)
}

export default SUPPLIER_API
