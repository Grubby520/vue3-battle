// 用于声明调用接口的方法
import URL from './url'
import { get, post } from '@shared/http'
import { yesOrNo } from './static'

const COMMONAPI = {
  // 获取字典通用接口,此接口用formdata传参,避免后端同事因太少的参数而创建一个对象
  getDict (params) {
    let formData = new FormData()
    Object.keys(params).forEach(key => {
      formData.append(key, params[key])
    })

    if (params.dataCode === 'YES_NO') {
      return Promise.resolve(yesOrNo)
    }

    return post(URL.dictUrl, formData).then(res => {
      let data = res.data || []
      return data
    })
  },
  // 分类
  category () {
    return get(URL.categoryUrl)
  },
  // 预上传oss接口
  getOssUrl (params) {
    return get(URL.ossUrl, { ...params })
  },
  // 预删除oss地址
  deleteOssUrl (params) {
    return get(URL.deleteOssUrl, params)
  },
  getTreeSelect () {
    return get(URL.treeSelect)
  }

}
export default COMMONAPI
