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

  // 删除oss文件
  deleteFiles (params) {
    return del(URL.deleteFilesUrl, params)
  },

  // plm分类树
  plmCategory () {
    return get(URL.plmCategory)
  }
}
export default COMMONAPI
