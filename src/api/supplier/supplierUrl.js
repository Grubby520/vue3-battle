const baseURL = '/'

export default {
  list: baseURL + 'supplier/list', // 列表
  statusList: baseURL + 'supplier/list/status', // 状态列表
  frozen: baseURL + 'supplier/frozen', // 冻结激活
  judgeMent: baseURL + 'supplier/judgeMent', // 审核
  resetPassword: baseURL + 'supplier/newPassword' // 重置密码
}
