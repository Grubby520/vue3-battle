import axios from 'axios'
import store from '@/store'
import { merge, getSessionItem } from '@shared/util'

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
    return res.data
  },
  err => {
    store.dispatch('CLOSE_LOADING')
    store.commit('SET_LOADING_COUNT', 0)
    // 错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 500: err.message = '服务器错误(500)'; break
        case 501: err.message = '服务未实现(501)'; break
        case 502: err.message = '网络错误(502)'; break
        case 503: err.message = '服务不可用(503)'; break
        case 504: err.message = '网络超时(504)'; break
        case 505: err.message = 'HTTP版本不受支持(505)'; break
        default: err.message = `连接出错(${err.response.status})!`
      }
    } else {
      err.message = '连接服务器失败!'
    }
    return Promise.reject(err)
  })

function addLoadingConfigToHeader (config) {
  if (config && config.addLoading !== undefined) {
    config.headers = config.headers ? config.headers = merge(config.headers, {
      addLoading: config.addLoading
    }) : { addLoading: config.addLoading }
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
