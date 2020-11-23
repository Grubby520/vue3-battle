const baseURL = '/product'
const RECOMMENDURLS = {
  // odm 列表页
  recommendproducts: baseURL + '/list',
  // 上传SPU数据 post
  upload_spu_data: baseURL + 'http://10.250.1.205:9300/product/importSpu',
  // odm推品
  recommend: baseURL + '/pushed',
  // odm 取消推品
  cancelrcommend: baseURL + '/cancel-pushed',
  // odm删除 详情
  rcommenduel: baseURL,
  // odm 状态
  recommendstatus: '/product/product-status',
  // odm 分类
  recommendCategory: '/category/list'
}

export default RECOMMENDURLS
