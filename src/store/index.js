import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemName: 'Starlink供应商平台',
    loadingInstance: null,
    breadcrumbs: [],
    activePath: null,
    menuCollapse: false
  },
  mutations: {
    SET_LAODING (state, loadingInstance) {
      state.loadingInstance = loadingInstance
    },

    SET_BREADCRUMBS (state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs
    },
    SET_ACTIVE_PATH (state, activePath) {
      state.activePath = activePath
    },
    SET_MENU_COLLAPSE (state, menuCollapse) {
      state.menuCollapse = menuCollapse
    }
  },
  actions: {
    OPEN_LOADING ({ commit }) {
      commit('SET_LAODING', Loading.service({ fullscreen: true }))
    },
    CLOSE_LOADING ({ state, commit }) {
      state.loadingInstance && state.loadingInstance.close()
      commit('SET_LAODING', null)
    }
  },
  modules: {
  }
})
