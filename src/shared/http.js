import axios from 'axios'
import store from '@/store'

function addLoading () {
  store.state.loadingCount++
  store.dispatch('OPEN_LOADING')
}

function closeLoading () {
  store.state.loadingCount--
  if (store.state.loadingCount === 0) {
    store.dispatch('CLOSE_LOADING')
  }
}

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 3000,
  headers: {}
})

// 请求拦截
axiosInstance.interceptors.request.use(config => {
  if (config.addLoading) {
    addLoading()
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
    closeLoading()
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

export const get = function (url, params) {
  return axiosInstance.get(url, { params })
}

export const del = function (url, params) {
  return axiosInstance.delete(url, { params })
}

export const post = function (url, params) {
  return axiosInstance.post(url, { data: params })
}

export const put = function (url, params) {
  return axiosInstance.put(url, { data: params })
}

export const patch = function (url, params) {
  return axiosInstance.patch(url, { data: params })
}

export const http = axiosInstance
