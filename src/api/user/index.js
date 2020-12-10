import { get, post, put } from '@shared/http'
import URL from './userUrl'

const USER_API = {
  authLogin: (params) => post(URL.authLogin, params),
  modifyPassword: (params) => post(URL.modifyPassword, params),
  register: (params) => post(URL.register, params),
  registerUpdate: (params) => post(URL.registerUpdate, params),
  getUserInfo: () => get(URL.userInfo),
  logout: () => get(URL.logout, {}, { addLoading: true }),
  resetPassword: (params) => get(URL.resetPassword, params, { addLoading: true }),
  isUserNameExist: (params) => get(URL.userNameExist, params),
  docDetails: () => get(URL.docDetails),
  docModify: (params) => post(URL.docModify, params),
  isCertificationNoExist: (params) => get(URL.certificationNoExist, params),
  isSupplierNameExist: (params) => get(URL.supplierNameExist, params),
  protocolConfirm: () => put(URL.protocolConfirm),
  getSupplierDetail: (params) => get(URL.supplierDetail, params)
}

export default USER_API
