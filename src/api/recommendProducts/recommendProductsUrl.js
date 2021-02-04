const baseURL = '/srm-goods-service'
const plmUrl = 'plm-product-service'
const RECOMMEND_URLS = {
  // 列表页
  getList: baseURL + '/product/page-list',
  // 状态
  recommendStatus: baseURL + '/product/product-status',
  // 尺码对照表
  pageList: plmUrl + '/size-table/category-id/',
  // 分类获取属性值
  plmCategoryAttrs: plmUrl + '/plm-category',
  // 校验供应商是否存在
  checkedItemNo: baseURL + '/product/check-exists/',
  // 创建产品保存
  productSave: baseURL + '/product/save',
  // 保存提交
  productSaveSubmit: baseURL + '/product/save-and-submit',
  // 补充信息
  replenish: baseURL + '/product/replenish',
  // 详情
  product: baseURL + '/product',
  // 列表提交
  submit: baseURL + '/product/submit',
  // 撤回
  cancel: baseURL + '/product/revoke'
}

export default RECOMMEND_URLS
