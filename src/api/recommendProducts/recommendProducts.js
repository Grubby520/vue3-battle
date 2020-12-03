import { get, del, put, post } from '@shared/http'
import RECOMMENDURLS from './recommendProductsUrl'
import qs from 'qs'
const RECOMMEND = {
  // odm推品列表
  getRecommedList ({ ...params }) {
    return post(RECOMMENDURLS.recommendproducts, qs.stringify(params))
  },
  // odm 推品删除
  deleteRecommed (id) {
    return del(`${RECOMMENDURLS.rcommenduel}/${id}`)
  },
  // 上传Spu数据
  // uploadSpuData (formData) {
  //   return post(RECOMMENDURLS.upload_spu_data, formData)
  // },
  // 下载SPU数据模板
  // spuDataTemplate (formData) {
  //   return get(RECOMMENDURLS.spu_data_template, formData)
  // },
  // odm撤回
  cancelrcommend (id) {
    return put(`${RECOMMENDURLS.cancelrcommend}/${id}`)
  },
  // odm 推品
  recommend (info) {
    return put(RECOMMENDURLS.recommend, info)
  },
  // odm 推品详情
  recommendDetail (id) {
    return get(`${RECOMMENDURLS.rcommenduel}/${id}`)
  },
  // 编辑推品
  modifyDetail (info) {
    return post(`${RECOMMENDURLS.rcommenduel}`, info)
  },
  // 校验供应商货号是否已存在
  checkItem (itemNo) {
    return get(`${RECOMMENDURLS.checkItem}/${itemNo}`)
  },
  save (params) {
    return post(RECOMMENDURLS.rcommenduel, params)
  },
  // 保存并提交
  saveSubmit (params) {
    return post(RECOMMENDURLS.saveSubmit, params)
  },
  // 属性项列表,颜色 id:1、尺寸 id:2
  getAttrList (id, params) {
    return get(RECOMMENDURLS.getAttrList + id, params)
  },
  // 自定义属性
  getMetadata (id) {
    return get(`/products/metadata/${id}/metafileds`)
  }
}
export default RECOMMEND
