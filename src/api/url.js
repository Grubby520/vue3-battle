// 用于存放接口地址
const baseURL = '/srm-goods-service'
const URL = {
  dictUrl: 'srm-common-service/data/name-value/list',
  categoryUrl: baseURL + '/category/list',
  // oss预上传地址
  ossUrl: baseURL + '/productImage/generatePreUploadUrl',
  // oss 预删除地址
  deleteOssUrl: baseURL + '/productImage/generatePreDeleteUrl',
  // treeSelect
  treeSelect: baseURL + '/products/category/tree'
}
export default URL
