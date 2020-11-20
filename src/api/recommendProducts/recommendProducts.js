import { get, http } from '@shared/http'
import RECOMMENDURLS from './recommendProductsUrl'
const RECOMMEND = {
  getRecommedList ({ ...params }) {
    return get(RECOMMENDURLS.RECOMMENDPRODUCTS, params)
  },
  deleteRecommed (id) {
    return delete (RECOMMENDURLS.DELETERCOMMEND, id)
  },
  // 上传Spu数据
  uploadSpuData (formData) {
    return http.post(RECOMMENDURLS.UPLOAD_SPU_DATA, formData)
  }
}
export default RECOMMEND
