// 用于声明调用接口的方法
import URL from './url'
import { get } from '@shared/http'
const COMMONAPI = {
  // 分类
  category () {
    return get(URL.categoryUrl)
  },
  // 预上传oss接口
  getOssUrl (params) {
    return get(URL.ossUrl, { params })
  },
  // 预删除oss地址
  deleteOssUrl (params) {
    return get(URL.deleteOssUrl, params)
  }

}
export default COMMONAPI
