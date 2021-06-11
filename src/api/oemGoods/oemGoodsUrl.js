const baseURL = '/oem-goods-service/'// 与后端微服务名对应

export default {
  purchaseOrderListUrl: baseURL + 'purchase-order/list', // 待接单列表
  receiveOrderUrl: baseURL + 'purchase-order/receive', // 接单
  pendingDeliverStaticUrl: baseURL + 'purchase-order/awaitshipment-statistics', // 待发货单列表统计
  deliveryConfirmListUrl: baseURL + 'delivery/delivery-confirm-list', // 确认发货列表
  logisticsCompanyUrl: baseURL + 'delivery/logistics-company', // 获取物流商信息
  deliveryUrl: baseURL + 'delivery', // 发货
  deliveryListUrl: baseURL + 'delivery/list', // 发货单列表
  genPreInvoiceBatchNoUrl: baseURL + 'delivery/gen-pre-invoice-batch-no', // 批量导出批次号、打印批次号
  deliverDetailUrl: baseURL + 'delivery/detail', // 发货详情
  deliverPrintUrl: baseURL + 'delivery/print', // 打印发货单
  logisticsInformationUrl: baseURL + 'delivery/logistics-information' // 获取物流信息
}
