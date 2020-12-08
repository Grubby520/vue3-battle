const baseURL = '/srm-user-service/'// 与后端微服务名对应

export default {
  authLogin: baseURL + 'auth/login',
  modifyPassword: baseURL + 'user/password/modify',
  register: baseURL + 'user/register',
  registerUpdate: baseURL + 'user/register/modify',
  userInfo: baseURL + 'user/info',
  logout: baseURL + 'user/logout',
  resetPassword: baseURL + 'user/newPassword',
  userNameExist: baseURL + 'user/user-name/exist',
  docDetails: baseURL + 'supplier/userId',
  docModify: baseURL + 'supplier',
  certificationNoExist: baseURL + 'supplier/certification/exist',
  supplierNameExist: baseURL + 'supplier/supplier-name/exist',
  protocolConfirm: baseURL + 'supplier/agreement/confirm',
  supplierDetail: baseURL + 'supplier/detail'
}
