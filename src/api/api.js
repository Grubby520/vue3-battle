// 用于声明调用接口的方法
import URL from './url'
import { get, post, del } from '@shared/http'
import { yesOrNo } from './static'

const COMMONAPI = {
  getDict (params) {
    if (params.dataCode === 'YES_NO') {
      return Promise.resolve(yesOrNo)
    }

    return get(URL.dictUrl, params).then(res => {
      let data = res.data || []
      return data
    })
  },

  // 预上传
  generatePreUploadUrl (params) {
    return post(URL.generatePreUploadUrl, params)
  },

  // 预上传
  deleteFiles (params) {
    return del(URL.deleteFilesUrl, params)
  },

  // 删除附件
  deleteAttachment (params) {
    return del(`${URL.deleteAttachmentUrl}/${params.id}`, params)
  },

  // 获取附件列表
  getAttachmentList (params) {
    return get(URL.attachmentListUrl, params)
  },

  // 保存附件关联关系
  saveAttachmentRelation (params) {
    return post(URL.attachmentRelation, params)
  },

  // 分类树
  category (params) {
    return get(URL.categoryUrl, params)
  }

}
export default COMMONAPI
