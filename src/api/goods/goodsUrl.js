const baseURL = '/srm-goods-service/'// 与后端微服务名对应

export default {
  purchaseStatistics: baseURL + 'purchase/agg',
  purchaseTabs: baseURL + 'purchase/agg/tabs',
  purchaseList: baseURL + 'purchase',
  defectiveList: baseURL + 'defective/defective-list'
}
