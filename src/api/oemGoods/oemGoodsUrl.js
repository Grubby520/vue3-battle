const baseURL = '/oem-goods-service/'// 与后端微服务名对应

export default {
  purchaseOrderListUrl: baseURL + 'purchase/purchase-order-list', // 发货单列表
  receiveOrderUrl: baseURL + 'purchase/receive', // 接单
  pendingDeliverStaticUrl: baseURL + 'purchase/await-shipments-list-statistics' // 待发货统计
}
