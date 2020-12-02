const baseURL = '/srm-goods-service'
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
  // odm删除 详情
  rcommenduel: baseURL + '/product',
  // odm 状态
  recommendstatus: baseURL + '/product/product-status',
  // odm 分类
  recommendCategory: baseURL + '/category/list',
  // 校验货号是否存在
  checkItem: baseURL + '/product/item-no-is-exist',
  // 获得尺寸的集合
  getSizeList: 'http://152.136.21.21:8080/mock/5fc0c322fd2b28481fbeea82/srm/product/size',
  // 获得颜色的集合
  getColorList: 'http://152.136.21.21:8080/mock/5fc0c322fd2b28481fbeea82/srm/product/color',
  saveSubmit: baseURL + '/product/save-and-submit'
}

export default RECOMMENDURLS
