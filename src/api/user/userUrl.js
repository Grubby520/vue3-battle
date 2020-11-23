const baseURL = '/user-service/'// 与后端微服务名对应

export default {
  authLogin: baseURL + 'auth/login',
  modifyPassword: baseURL + 'user/password/modify',
  register: baseURL + 'user/register',
  userInfo: baseURL + 'user/info',
  logout: baseURL + 'user/logout',
  docDetails: baseURL + 'supplier/userId',
  docModify: baseURL + 'supplier'
}
