import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingInstance: null,
    breadcrumbs: []
  },
  mutations: {
    setLoadingInstance (state, payload) {
      state.loadingInstance = payload
    },
    setBreadcrumbs (state, payload) {
      state.breadcrumbs = payload
    }
  },
  actions: {
    createLoading ({ commit }) {
      commit('setLoadingInstance', Loading.service({ fullscreen: true }))
    },
    closeLoading ({ state, commit }) {
      state.loadingInstance && state.loadingInstance.close()
      commit('setLoadingInstance', null)
    }
  },
  modules: {
  }
})
