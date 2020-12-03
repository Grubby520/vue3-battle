// 用于存放接口地址
const baseURL = '/srm-goods-service'
const productUrl = '/srm-common-service'
const URL = {
  dictUrl: 'srm-common-service/data/name-value/list',
  // 分类树
  categoryUrl: productUrl + '/product-service/category/tree',
  // oss预上传地址
  ossUrl: '/srm-common-service' + '/aliyun-oss/generatePreUploadUrl',
  // oss 预删除地址
  deleteOssUrl: baseURL + '/productImage/generatePreDeleteUrl'
}
export default URL
