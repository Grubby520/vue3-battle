import { get, del, put, post } from '@shared/http'
import RECOMMENDURLS from './recommendProductsUrl'
const RECOMMEND = {
  // odm推品列表
  getRecommedList ({ ...params }) {
    return get(RECOMMENDURLS.recommendproducts, params)
  },
  // odm 推品删除
  deleteRecommed (id) {
    return del(`${RECOMMENDURLS.rcommenduel}/${id}`)
  },
  // 上传Spu数据
  uploadSpuData (formData) {
    return post(RECOMMENDURLS.upload_spu_data, formData)
  },
  // odm取消推品
  cancelrcommend (info) {
    console.log(info)
    return put(RECOMMENDURLS.cancelrcommend, info)
  },
  // odm 推品
  recommend (info) {
    return put(RECOMMENDURLS.recommend, info, { addLoading: true })
  },
  // odm 推品详情
  recommendDetail (id) {
    return get(`${RECOMMENDURLS.rcommenduel}/${id}`)
  },
  // 编辑推品
  modifyDetail (info) {
    return post(`${RECOMMENDURLS.rcommenduel}`, info)
  },
  checkItem (itemNo) {
    return get(`${RECOMMENDURLS.checkItem}/${itemNo}`)
  }
}
export default RECOMMEND
