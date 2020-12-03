import { get, post, put } from '@shared/http'
import URL from './userUrl'

const USER_API = {
  authLogin: (params) => post(URL.authLogin, params),
  modifyPassword: (params) => post(URL.modifyPassword, params),
  register: (params) => post(URL.register, params),
  getUserInfo: () => get(URL.userInfo),
  logout: () => get(URL.logout, {}, { addLoading: true }),
  resetPassword: (params) => get(URL.resetPassword, params, { addLoading: true }),
  docDetails: () => get(URL.docDetails),
  docModify: (params) => post(URL.docModify, params),
  isCertificationNoExist: (params) => get(URL.certificationNoExist, params),
  protocolConfirm: () => put(URL.protocolConfirm),
  getSupplierDetail: (params) => get(URL.supplierDetail, params)
}

export default USER_API
