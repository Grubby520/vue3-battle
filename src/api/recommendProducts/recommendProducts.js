import { get, http } from '@shared/http'
import RECOMMENDURLS from './recommendProductsUrl'
const RECOMMEND = {
  getList ({ ...params }) {
    return get(RECOMMENDURLS.recommendProducts, params)
  },
  // 上传Spu数据
  uploadSpuData (formData) {
    return http.post(RECOMMENDURLS.UPLOAD_SPU_DATA, formData)
  }
}
export default RECOMMEND
