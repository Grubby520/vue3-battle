import { get, post, put } from '@shared/http'
import URLS from './urls'

const IMPORT_PRODUCT_API = {
  // 上传之前的预检请求
  preUploadAction (params) {
    return get(URLS.PRE_UPLOAD, params)
  },
  // 上传阿里云
  ossUploadAction (url, data, config) {
    return put(url, data, config)
  },
  // 上传之后的入库
  afterUploadAction (params) {
    return post(URLS.AFTER_UPLOAD, params)
  }
}
export default IMPORT_PRODUCT_API
