const baseURL = '/goods-service'
const RECOMMENDURLS = {
  // odm 列表页
  recommendproducts: baseURL + '/product/list',
  // 上传SPU数据 post
  upload_spu_data: baseURL + 'http://10.250.1.205:9300/product/importSpu',
  // odm推品
  recommend: baseURL + '/product/pushed',
  // odm 取消推品
  cancelrcommend: baseURL + '/product/cancel-pushed',
  // odm删除 详情
  rcommenduel: baseURL + '/product',
  // odm 状态
  recommendstatus: baseURL + '/product/product-status',
  // odm 分类
  recommendCategory: baseURL + '/category/list',
  // 校验货号是否存在
  checkItem: baseURL + '/product/check-item-no'
}

export default RECOMMENDURLS
