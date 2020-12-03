// 用于声明调用接口的方法
import URL from './url'
import { get, post } from '@shared/http'
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
  // 分类树
  category () {
    return get(URL.categoryUrl)
  }

}
export default COMMONAPI
