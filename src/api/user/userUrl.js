const baseURL = '/user-service/'// 与后端微服务名对应

export default {
  authLogin: baseURL + 'auth/login',
  modifyPassword: baseURL + 'user/password/modify',
  register: baseURL + 'user/register',
  userInfo: baseURL + 'user/info',
  logout: baseURL + 'user/logout',
  resetPassword: baseURL + 'user/newPassword',
  list: baseURL + 'supplier/list', // 列表
  statusList: baseURL + 'supplier/list/status', // 状态列表
  frozen: baseURL + 'supplier/frozen', // 冻结激活
  judgeMent: baseURL + 'supplier/judgeMent', // 审核
  access: baseURL + 'supplier/status/pass', // 准入
  docDetails: baseURL + 'supplier/userId',
  docModify: baseURL + 'supplier'
}
