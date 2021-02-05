import { get, del, put, post } from '@shared/http'
import RECOMMEND_URLS from './recommendProductsUrl'
// import qs from 'qs'
const RECOMMEND = {
  // odm推品列表
  getList ({ ...params }) {
    return post(RECOMMEND_URLS.getList, params)
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
  },
  // 删除商品
  deleteProduct (id) {
    return del(`${RECOMMEND_URLS.product}/${id}`)
  },
  // 撤回
  cancel (id) {
    return put(`${RECOMMEND_URLS.cancel}/${id}`)
  }
}
export default RECOMMEND
