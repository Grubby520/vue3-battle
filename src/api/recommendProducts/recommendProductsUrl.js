const baseURL = '/api/v1/srm-goods-service'
const productUrl = '/api/v1/product-service'
const plmUrl = 'plm-product-service'

const RECOMMENDURLS = {
  // odm 列表页
  recommendproducts: baseURL + '/product/page-list',
  // 上传SPU数据 post
  spu_data_template: baseURL + '/template/getTemplateUrl?code=IMPORT_SPU',
  // 上传SPU数据 post
  upload_spu_data: baseURL + '/product/importSpu',
  // odm提交
  recommend: baseURL + '/product/submit',
  // odm 撤回
  cancelrcommend: baseURL + '/product/revoke',
  // odm详情
  rcommenduel: baseURL + '/product',
  // odm 状态
  recommendstatus: baseURL + '/product/product-status',
  // odm 分类
  recommendCategory: baseURL + '/category/list',
  // 校验货号是否存在
  checkItem: baseURL + '/product/supplier-item-no-is-exist',
  saveSubmit: baseURL + '/product/save-and-submit',
  // 保存补充信息
  supplementSave: baseURL + '/product/supplement-info',
  // 保存并提交补充
  supplement: baseURL + '/product/supplement-info/save-and-submit',
  // 属性项列表,颜色、尺寸
  getAttrList: productUrl + '/attribute/list-term/',
  // 根据用户获取颜色尺寸id
  allByUser: productUrl + '/attribute/all_by_user/',

  // 尺码对照表
  pageList: plmUrl + '/size-table/category-id/',
  // 分类获取属性值
  plmCategoryAttrs: plmUrl + '/plm-category'
}

export default RECOMMENDURLS
