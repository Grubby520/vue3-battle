import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui'
import userInfo from './userInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemName: 'Starlink供应商平台',
    loadingInstance: null,
    loadingCount: 0, // 用于计算请求的次数
    breadcrumbs: [],
    activePath: null,
    menuCollapse: false,
    userInfo
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
    },
    SET_LOADING_COUNT (state, loadingCount) {
      state.loadingCount = loadingCount
    },
    SET_USER_INFO (state, userInfo) {
      state.userInfo = Object.assign(state.userInfo, userInfo)
    }
  },
  actions: {
    OPEN_LOADING ({ state, commit }) {
      if (!state.loadingInstance) {
        commit('SET_LAODING', Loading.service({ fullscreen: true }))
      }
    },
    CLOSE_LOADING ({ state, commit }) {
      state.loadingInstance && state.loadingInstance.close()
      commit('SET_LAODING', null)
    }
  },
  modules: {
  }
})
