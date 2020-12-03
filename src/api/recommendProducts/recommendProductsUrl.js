const baseURL = '/srm-goods-service'
const productUrl = '/product-service'

const RECOMMENDURLS = {
  // odm 列表页
  recommendproducts: baseURL + '/product/page-list',
  // 上传SPU数据 post
  spu_data_template: baseURL + '/template/getTemplateUrl?code=IMPORT_SPU',
  // 上传SPU数据 post
  upload_spu_data: baseURL + '/product/importSpu',
  // odm推品
  recommend: baseURL + '/product/pushed',
  // odm 撤回
  cancelrcommend: baseURL + '/product/revoke',
  // odm详情
  rcommenduel: baseURL + '/product',
  // odm 状态
  recommendstatus: baseURL + '/product/product-status',
  // odm 分类
  recommendCategory: baseURL + '/category/list',
  // 校验货号是否存在
  checkItem: baseURL + '/product/item-no-is-exist',
  saveSubmit: baseURL + '/product/save-and-submit',
  // 属性项列表,颜色、尺寸
  getAttrList: productUrl + '/attribute/list-term/'
}

export default RECOMMENDURLS
