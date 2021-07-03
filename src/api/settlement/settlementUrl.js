const baseURL = '/srm-settlement-service/'// 与后端微服务名对应

export default {
  exportSettlement: baseURL + 'settlement/export-settlement', // 结算单导出
  settlementListUrl: baseURL + 'settlement/list', // 结算单列表
  supplierConfirmUrl: baseURL + 'settlement/supplier-confirm', // 确认结算单
  deliveryInfoUrl: baseURL + 'settlement/settlement-order-delivery-info', // 发货单详情
  supplyDetailsUrl: baseURL + 'settlement/settlement-order-supply-details', // 供货详情
  paymentOrderListUrl: baseURL + 'payment-request/oem-list', // 请款单列表
  paymentOrderDetailUrl: baseURL + 'payment-request/detail', // 请款单详情
  settlementOrderInfoUrl: baseURL + 'payment-request/settlement-order-info', // 结算单信息
  supplementaryDeductionInfoUrl: baseURL + 'payment-request/supplementary-deduction-info', // 补扣款单信息
  exportSettlementInfoUrl: baseURL + 'payment-request/export/settlement-order-info', // 导出
  exportInvoiceUrl: baseURL + 'payment-request/export/invoice', // 下载发票
  exportSupplyListUrl: baseURL + 'payment-request/export/supply-list', // 下载请款单
  attachmentListUrl: baseURL + 'attachment/list', // 查询附件列表
  saveAttachmentRelationsUrl: baseURL + 'attachment/relation' // 保存附件与业务的关系
}
