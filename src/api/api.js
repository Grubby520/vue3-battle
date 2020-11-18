// 用于声明调用接口的方法
import URL from 'url'
import { get, put, post } from '@shared/http'
const COMMONAPI = {
  // 上传
  download ({ ...params }) {
    return get(URL.uploadDownIMages, params)
  },
  uploadFile ({ ...params }) {
    return post(URL.uploadFile, params)
  },
  getOss ({ ...params }) {
    return put(URL.getOss, params)
  }

}
export default COMMONAPI
