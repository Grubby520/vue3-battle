const baseURL = '/srm-settlement-service/'// 与后端微服务名对应

export default {
  exportSettlement: baseURL + 'settlement/export-settlement', // 结算单导出
  settlementListUrl: baseURL + 'settlement/list', // 结算单列表
  supplierConfirmUrl: baseURL + 'settlement/supplier-confirm', // 确认结算单
  deliveryInfoUrl: baseURL + 'settlement/settlement-order-delivery-info', // 发货单详情
  supplyDetailsUrl: baseURL + 'settlement/settlement-order-supply-details' // 供货详情
}
