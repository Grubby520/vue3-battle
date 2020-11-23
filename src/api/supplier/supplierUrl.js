const baseURL = '/supplier/'

export default {
  list: baseURL + 'list', // 列表
  statusList: baseURL + 'list/status', // 状态列表
  frozen: baseURL + 'frozen', // 冻结激活
  judgeMent: baseURL + 'judgeMent', // 审核
  access: baseURL + 'status/pass' // 准入
}
