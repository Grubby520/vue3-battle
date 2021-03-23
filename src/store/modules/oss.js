import axios from 'axios'
import CommonApi from '@api/api'
import { put } from '@shared/http'
const CancelToken = axios.CancelToken

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    GET_UPLOAD_API ({ commit, dispatch }, params) {
      return CommonApi.generatePreUploadUrl(params).then((res) => {
        const { success } = res
        if (success) {
          return res
        }
      })
    },
    UPLOAD_FILE ({ commit, dispatch }, params) {
      let { preUploadUrl, file } = params
      // 解决非相同协议上传oss失败的问题
      let uploadUrl = preUploadUrl.replace(/^(http|https)?=(:\/\/)/, window.location.protocol.split(':')[0])
      return put(uploadUrl, file, {
        headers: { 'Content-Type': file.type ? file.type : 'application/octet-stream' },
        cancelToken: new CancelToken(function executor (c) {
          params.file.abort = c
        })
      })
        .then(res => {
          return res
        }).catch(error => {
          return Promise.reject(error)
        })
    },
    DELETE_FILES ({ commit, dispatch }, params) {
      return CommonApi.deleteFiles(params)
        .then(res => {
          return res
        })
    }
  }
}
