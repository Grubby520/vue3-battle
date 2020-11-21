import { get, http, del, put, post } from '@shared/http'
import RECOMMENDURLS from './recommendProductsUrl'
const RECOMMEND = {
  // odm推品列表
  getRecommedList ({ ...params }) {
    return get(RECOMMENDURLS.RECOMMENDPRODUCTS, params)
  },
  // odm 推品删除
  deleteRecommed (id) {
    return del(`${RECOMMENDURLS.RCOMMENDUEL}${id}`)
  },
  // 上传Spu数据
  uploadSpuData (formData) {
    return http.post(RECOMMENDURLS.UPLOAD_SPU_DATA, formData)
  },
  // odm取消推品
  cancelrcommend (info) {
    console.log(info)
    return put(RECOMMENDURLS.CANCELRCOMMEND, info)
  },
  // odm 推品
  recommend (info) {
    return put(RECOMMENDURLS.RECOMMEND, info)
  },
  // odm 推品详情
  recommendDetail (id) {
    return get(`${RECOMMENDURLS.RCOMMENDUEL}${id}`)
  },
  // 编辑推品
  modifyDetail (info) {
    return post(`${RECOMMENDURLS.RCOMMENDUEL}`, info)
  }
}
export default RECOMMEND
