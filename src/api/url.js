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
  treeSelect: 'http://152.136.21.21:8080/mock/5fc0c322fd2b28481fbeea82/srm/getTree'
}
export default URL
