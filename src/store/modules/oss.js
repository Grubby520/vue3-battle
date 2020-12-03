import CommonApi from '@api/api'
import { put } from '@shared/http'

export default {
  namespaced: true,
  state: {

  },
  getters: {

  },
  mutations: {

  },
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
      put(preUploadUrl, file, { headers: { 'Content-Type': file.type } })
        .then(res => {
          return res
        })
    }
  }
}
