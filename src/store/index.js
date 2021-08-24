import Vue from 'vue'
import Vuex from 'vuex'
import { Loading } from 'element-ui'
import { loadModules } from './loadModules'
import { setLocalStorageItem } from '@shared/util'
const modules = loadModules()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemName: '马上发商家系统',
    loadingInstance: null,
    loadingCount: 0, // 用于计算请求的次数
    breadcrumbs: [],
    activePath: null,
    menuCollapse: false,
    hasVersionUpdated: false, // 版本是否更新
    uniformlyCapturedErrorCodes: [] // 用于存储统一捕获的异常代码,用于判断，避免多次弹出异常提示
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
      setLocalStorageItem('activePath', activePath)
    },
    SET_MENU_COLLAPSE (state, menuCollapse) {
      state.menuCollapse = menuCollapse
    },
    SET_LOADING_COUNT (state, loadingCount) {
      state.loadingCount = loadingCount
    },
    SET_VERSION_UPDATED (state, hasVersionUpdated) {
      state.hasVersionUpdated = hasVersionUpdated
    },
    ADD_UNIFORMLY_ERROR_CODES (state, { code, clear = false }) {
      if (clear) {
        state.uniformlyCapturedErrorCodes = []
      } else {
        state.uniformlyCapturedErrorCodes = Array.from(new Set([...this.state.uniformlyCapturedErrorCodes, code]))
      }
    }
  },
  actions: {
    OPEN_LOADING ({ state, commit }, { isCount = false, loadingText = '加载中' }) {
      if (isCount) { // 是否计数,用于请求拦截场景
        state.loadingCount++
      }
      if (!state.loadingInstance) {
        commit('SET_LAODING', Loading.service({ fullscreen: true, text: loadingText }))
      }
    },
    CLOSE_LOADING ({ state, commit }, isCount = false) {
      if (isCount) {
        state.loadingCount--
        if (state.loadingCount > 0) {
          return
        }
      }
      state.loadingInstance && state.loadingInstance.close()
      commit('SET_LAODING', null)
    }
  },
  modules
})
