const baseURL = '/srm-goods-service/'// 与后端微服务名对应

export default {
  attachmentListUrl: baseURL + 'attachment/list', // 查询附件列表
  purchaseStatistics: baseURL + 'purchase/agg',
  purchaseTabs: baseURL + 'purchase/agg/tabs',
  purchaseList: baseURL + 'purchase',
  defectiveList: baseURL + 'defective/defective-list',
  groupTabs: baseURL + 'group-list/agg/tabs',
  groupList: baseURL + 'group-list', // 待组单商品列表
  groupSplite: baseURL + 'group-list/splite', // 拆单
  groupGenerateShippedBill: baseURL + 'group-list/general-shipped-bill', // 生成发货单
  groupExport: baseURL + 'group-list/export', // 导出待发货商品详情
  invoiceList: baseURL + 'invoice/invoice-list', // 发货单列表
  invoiceDetail: baseURL + 'invoice/invoice-detail', // 发货单详情
  logisticsCompany: baseURL + 'invoice/logistics-company', // 获取物流商信息
  logisticsInfo: baseURL + 'invoice/logisticsInformation', // 获取物流信息
  exportExcel: baseURL + 'invoice/export/delivery-order', // 导出表格
  printInvoice: baseURL + 'invoice/print', // 打印发货单
  printNo: baseURL + 'invoice/gen-pre-invoice-batch-no', // 打印批次号
  modifyInvoice: baseURL + 'invoice/update-invoice', // 发货单修改
  modifyLogisticsNo: baseURL + 'invoice/add-logistics-number', // 发货单修改
  settlementOrderList: baseURL + 'settlement-order/list', // 结算单列表
  exportSettlement: baseURL + 'settlement-order/export-settlement', // 结算单导出
  supplierConfirm: baseURL + 'settlement-order/supplier-confirm', // 商家确认
  deliveryInfo: baseURL + 'settlement-order/settlement-order-delivery-info', // 发货单结算信息
  supplyDetails: baseURL + 'settlement-order/settlement-order-supply-details', // 供货明细
  supplementaryDeductionInfo: baseURL + 'settlement-order/settlement-supplementary-deduction', // 补扣款单信息
  paymentInfo: baseURL + 'reimbursement/payment-info', // 付款单信息查询
  financeInfo: baseURL + 'reimbursement/finance-info', // 财务信息查询
  settlementOrder: baseURL + 'reimbursement/settlement-order-info', // 结算单信息查询
  supplementaryDeduction: baseURL + 'reimbursement/supplementary-deduction-info', // 补扣款单信息查询
  supplyDeductionList: baseURL + 'supplementary-deduction/list', // 补扣款单列表
  reimbursementList: baseURL + 'reimbursement/page-list', // 请款单列表
  exportReimbursementList: baseURL + 'reimbursement/export/settlement-order-info', // 请款单详情导出
  exportInvoice: baseURL + 'reimbursement/export/invoice', // 下载发票
  exportRequestForm: baseURL + 'reimbursement/export/request-form', // 下载请款单
  exportSupplyList: baseURL + 'reimbursement/export/supply-list', // 下载供货清单
  updateReimbursementAttachments: baseURL + 'reimbursement/update-attachment' // 保存请款单附件
}
