const baseURL = '/srm-common-service/'// 与后端微服务名对应

const URL = {
  // 通过字典接口
  dictUrl: baseURL + 'data/name-value/list',
  // 生成预上传链接接口
  generatePreUploadUrl: '/srm-common-service/aliyun-oss/upload-presigned',
  // 删除文件
  deleteFilesUrl: baseURL + 'aliyun-oss',
  // plm 分类树
  plmCategory: '/plm-product-service/plm-category/tree'
}
export default URL
