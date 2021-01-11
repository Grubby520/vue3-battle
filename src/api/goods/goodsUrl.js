const baseURL = '/srm-goods-service/'// 与后端微服务名对应

export default {
  purchaseStatistics: baseURL + 'purchase/agg',
  purchaseTabs: baseURL + 'purchase/agg/tabs',
  purchaseList: baseURL + 'purchase',
  defectiveList: baseURL + 'defective/defective-list',
  invoiceList: baseURL + '/invoice/invoice-list', // 发货单列表
  statusList: baseURL + '/data/name-value/list', //  获取发货单状态
  invoiceDetail: baseURL + 'nvoice/invoice-detail' // 发货单详情
}
