import { get, post, put } from '@shared/http'
import URL from './userUrl'

const USER_API = {
  authLogin: (params) => post(URL.authLogin, params),
  modifyPassword: (params) => post(URL.modifyPassword, params),
  register: (params) => post(URL.register, params),
  getUserInfo: () => get(URL.userInfo),
  logout: () => get(URL.logout, {}, { addLoading: true }),
  resetPassword: (params) => get(URL.resetPassword, params, { addLoading: true }),
  getList: (params) => post(URL.list, params),
  getSupplierStatus: () => get(URL.statusList),
  frozen: (params) => put(URL.frozen, params, { addLoading: true }),
  cancelFrozen: (params) => put(URL.cancelFrozen, params, { addLoading: true }),
  audit: (params) => put(URL.judgeMent, params),
  access: (params) => put(URL.access, params, { addLoading: true }),
  docDetails: () => get(URL.docDetails),
  docModify: (params) => post(URL.docModify, params)
}

export default USER_API
