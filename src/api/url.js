const baseURL = '/srm-common-service/'// 与后端微服务名对应

const URL = {
  // 通过字典接口
  dictUrl: baseURL + 'data/name-value/list',
  // 生成预上传链接接口
  generatePreUploadUrl: baseURL + 'aliyun-oss/upload-presigned',
  // 删除文件
  deleteFilesUrl: baseURL + 'aliyun-oss',
  deleteAttachmentUrl: baseURL + 'attachment',
  attachmentListUrl: baseURL + 'attachment/list',
  attachmentRelation: baseURL + 'attachment/relation',
  // 分类树
  categoryUrl: '/product-service/category/tree'
}
export default URL
