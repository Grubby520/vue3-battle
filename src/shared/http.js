import axios from 'axios'
import store from '@/store'
import { merge, getSessionItem, errorMessageTip, errorNotify } from '@shared/util'

// 存储http错误状态信息
let httpErrorCache = {}
// 同一类型的http错误,在以下时间内只做一次ui提示
const errorTimeInterval = 1000

let baseURL = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : ''
const useProxy = process.env.VUE_APP_USE_PROXY === 'true' && process.env.NODE_ENV === 'development'
baseURL = useProxy ? '/api' : baseURL

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  headers: {}
})

// 请求拦截
axiosInstance.interceptors.request.use(config => {
  const token = getSessionItem('token')
  const userKey = getSessionItem('userKey')

  if (config.headers['addLoading']) {
    store.dispatch('OPEN_LOADING', true)
    delete config.headers['addLoading']
  }

  if (token) {
    config.headers['token'] = token
  }

  if (userKey) {
    config.headers['userKey'] = userKey
  }

  return config
}, err => {
  store.dispatch('CLOSE_LOADING')
  store.commit('SET_LOADING_COUNT', 0)
  // 错误处理
  return Promise.reject(err)
})

// 响应拦截
axiosInstance.interceptors.response.use(
  res => {
    store.dispatch('CLOSE_LOADING', true)
    let { error } = res.data
    if (error) {
      switch (error.code) {
        case '100001': // 未登录
        case '100002': // 账号在别处登录
        case '100003': // 授权过期,请重新登录
        case '200001': // 用户不存在或密码错误
        case '200002': // 原密码错误
        case '200003': // 公司名重复注册
        case '200004': // 账号重复注册
        case '500001': // 参数异常
        case '500002': // 数据不存在
        case '500003': // 数据冲突
        case '500004': // 超出最大限制
          errorMessageTip(error.message)
          break
      }
    }

    return res.data
  },
  err => {
    let errorStatus
    store.dispatch('CLOSE_LOADING')
    store.commit('SET_LOADING_COUNT', 0)
    // 错误处理
    if (err && err.response) {
      errorStatus = err.response.status
      switch (errorStatus) {
        case 500:
          err.message = '服务器错误(500)'
          break
        case 501: err.message = '服务未实现(501)'
          break
        case 502: err.message = '网络错误(502)'
          break
        case 503: err.message = '服务不可用(503)'
          break
        case 504: err.message = '网络超时(504)'
          break
        case 505: err.message = 'HTTP版本不受支持(505)'
          break
        case 404: err.message = '访问资源不存在(404)'
          break
        case 429: err.message = '系统繁忙,请稍后重试'
          break
        default: err.message = `连接出错(${err.response.status})!`
      }
    } else {
      err.message = '连接服务器失败!'
    }

    if (!httpErrorCache[errorStatus]) {
      httpErrorCache[errorStatus] = {
        time: +new Date()
      }
      errorNotify(null, err.message)
    } else {
      let now = +new Date()
      if (now - httpErrorCache[errorStatus].time > errorTimeInterval) {
        errorNotify(null, err.message)
        httpErrorCache[errorStatus].time = now
      }
    }
    return Promise.reject(err)
  })

function addLoadingConfigToHeader (config) {
  if (config && config.addLoading !== undefined) {
    if (config.headers) {
      config.headers = merge(config.headers, {
        addLoading: config.addLoading
      })
    } else {
      config.headers = { addLoading: config.addLoading }
    }

    delete config.addLoading
  }
  return config
}

export const get = function (url, params, config) {
  config = addLoadingConfigToHeader(config)
  return axiosInstance.get(url, {
    params,
    ...config
  })
}

export const del = function (url, params, config) {
  config = addLoadingConfigToHeader(config)
  return axiosInstance.delete(url, { params, ...config })
}

export const post = function (url, params, config) {
  config = addLoadingConfigToHeader(config)
  return axiosInstance.post(url, params, config)
}

export const put = function (url, params, config) {
  config = addLoadingConfigToHeader(config)
  return axiosInstance.put(url, params, config)
}

export const patch = function (url, params, config) {
  config = addLoadingConfigToHeader(config)
  return axiosInstance.patch(url, params, config)
}

export const http = axiosInstance
