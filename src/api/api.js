// 用于声明调用接口的方法
import URL from './url'
import { get } from '@shared/http'
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
  // 分类
  category () {
    return get(URL.categoryUrl)
  },
  // 预上传oss接口
  getOssUrl (params) {
    return get(URL.ossUrl, { ...params })
  },
  // 预删除oss地址
  deleteOssUrl (params) {
    return get(URL.deleteOssUrl, params)
  },
  getTreeSelect () {
    return get(URL.treeSelect)
  }

}
export default COMMONAPI
