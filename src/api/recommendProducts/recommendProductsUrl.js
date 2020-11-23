const baseURL = '/product'
const RECOMMENDURLS = {
  // odm 列表页
  RECOMMENDPRODUCTS: baseURL + '/list',
  // 上传SPU数据 post
  UPLOAD_SPU_DATA: '/product/importSpu',
  // odm推品
  RECOMMEND: baseURL + '/pushed',
  // odm 取消推品
  CANCELRCOMMEND: baseURL + '/cancel-pushed',
  // odm删除 详情
  RCOMMENDUEL: baseURL
  // // odm 状态
  // RECOMMENDSTATUS: '/product/product-status'
}

export default RECOMMENDURLS
