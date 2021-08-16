/*
 * @Author: 张建
 * @Date: 2021-06-22 09:10:31
 * @LastEditors: 张建
 * @LastEditTime: 2021-06-22 14:56:37
 * @Description: file content
 */
const baseURL = '/srm-goods-service/'// 与后端微服务名对应

export default {
  remarks: baseURL + 'invoice/update-remarks', // 备注
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
  stockOutList: baseURL + 'stock-out/page-srm-list', // 缺货列表
  stockOutApply: baseURL + 'stock-out', // 申请缺货
  productDashboardList: baseURL + 'product-dashboard/page', // 商品看板列表查询
  productColor: baseURL + 'product-dashboard/query-color', // 商品颜色列表
  selfDistributionLogistics: baseURL + 'sequence-generator/generate-by-date' // 自配送物流
}
