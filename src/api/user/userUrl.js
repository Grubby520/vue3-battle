const baseURL = '/srm-user-service/'// 与后端微服务名对应

export default {
  payeePowerOfAttorney: 'http://srm-file-public-prod.oss-cn-shanghai.aliyuncs.com/srm/template/供应商收款委托书(RMB).docx', // 收款委托书
  authLogin: baseURL + 'auth/login',
  modifyPassword: baseURL + 'user/password/modify',
  register: baseURL + 'user/register',
  registerUpdate: baseURL + 'user/register/modify',
  userInfo: baseURL + 'user/info',
  logout: baseURL + 'user/logout',
  resetPassword: baseURL + 'user/newPassword',
  userNameExist: baseURL + 'user/user-name/exist',
  certificationNoExist: baseURL + 'supplier/certification/exist',
  supplierNameExist: baseURL + 'supplier/supplier-name/exist',
  protocolConfirm: baseURL + 'supplier/agreement/confirm',
  supplierDetail: baseURL + 'supplier/detail',
  supplierBasic: baseURL + 'supplier/detail/basic',
  supplierBank: baseURL + 'supplier/detail/bank',
  supplierUpdate: baseURL + 'supplier/detail/basic/update',
  shippingAddressExists: baseURL + 'supplier/shipping-address-exists'
}
