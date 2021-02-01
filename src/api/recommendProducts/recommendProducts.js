import { get, del, put, post } from '@shared/http'
import RECOMMEND_URLS from './recommendProductsUrl'
// import qs from 'qs'
const RECOMMEND = {
  // odm推品列表
  getRecommendList ({ ...params }) {
    return post(RECOMMEND_URLS.recommendProducts, params)
  },
  // odm 推品删除
  deleteRecommend (id) {
    return del(`${RECOMMEND_URLS.recommendUrl}/${id}`)
  },
  // 上传Spu数据
  // uploadSpuData (formData) {
  //   return post(RECOMMEND_URLS.upload_spu_data, formData)
  // },
  // 下载SPU数据模板
  // spuDataTemplate (formData) {
  //   return get(RECOMMEND_URLS.spu_data_template, formData)
  // },
  // odm撤回
  cancelRecommend (id) {
    return put(`${RECOMMEND_URLS.cancelRecommend}/${id}`)
  },
  // odm 提交
  recommend (info) {
    return put(RECOMMEND_URLS.recommend, info)
  },
  // odm 推品详情
  recommendDetail (id) {
    return get(`${RECOMMEND_URLS.recommendUrl}/${id}`)
  },
  // 编辑推品
  modifyDetail (info) {
    return post(`${RECOMMEND_URLS.recommendUrl}`, info)
  },
  // 校验供应商货号是否已存在
  checkItem (itemNo) {
    return get(`${RECOMMEND_URLS.checkItem}/${itemNo}`)
  },
  save (params) {
    return post(RECOMMEND_URLS.recommendUrl, params)
  },
  // 保存并提交
  saveSubmit (params) {
    return post(RECOMMEND_URLS.saveSubmit, params)
  },
  // 保存补充
  supplementSave (params) {
    return put(RECOMMEND_URLS.supplementSave, params)
  },
  // 保存并补充提交
  supplement (params) {
    return put(RECOMMEND_URLS.supplement, params)
  },
  // 属性项列表,颜色 id:1、尺寸 id:2
  getAttrList (id, params) {
    return get(RECOMMEND_URLS.getAttrList + id, params)
  },
  // 自定义属性
  getMetadata (id) {
    return get(`/product-service/metadata/${id}/metafileds`)
  },
  // 根据用户获取颜色尺寸id
  allByUser (params) {
    return get(RECOMMEND_URLS.allByUser, params)
  },

  // 尺码对照表
  pageList (id) {
    return get(RECOMMEND_URLS.pageList + id)
  },
  // 分类获取属性值
  plmCategoryAttrs (id, params) {
    return get(`${RECOMMEND_URLS.plmCategoryAttrs}/${id}/attribute-and-term`, params)
  },
  // 校验供应商是否存在
  checkedItemNo (params) {
    return get(`${RECOMMEND_URLS.checkedItemNo}${params}`)
  },
  // 保存
  productSave (params) {
    return post(RECOMMEND_URLS.productSave, params)
  },
  // 保存提交
  productSaveSubmit (params) {
    return post(RECOMMEND_URLS.productSaveSubmit, params)
  },
  // 补充信息
  replenish (params) {
    return put(RECOMMEND_URLS.replenish, params)
  },
  // 详情
  product (params) {
    return get(`${RECOMMEND_URLS.product}/${params}`)
  },
  // 列表提交
  submit (params) {
    return put(RECOMMEND_URLS.submit, params)
  }
}
export default RECOMMEND
