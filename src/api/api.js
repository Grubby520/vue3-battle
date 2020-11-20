// 用于声明调用接口的方法
import URL from './url'
import { get } from '@shared/http'
const COMMONAPI = {
  // 上传
  download ({ ...params }) {
    return get(URL.uploadDownIMages, params)
  },
  category () {
    return get(URL.categoryUrl)
  },
  getOssUrl (params) {
    return get(URL.ossUrl, params)
  }

}
export default COMMONAPI
