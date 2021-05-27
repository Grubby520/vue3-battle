import { setCookie, removeCookie, setSessionItem, getSessionItem, removeSessionItem, downloadFile } from '@shared/util'
import { homeStaticRoutes } from '@/router/homeRoutes.js'
import ODM_ROUTES from '@/router/routes/ODM_ROUTES'
import OEM_ROUTES from '@/router/routes/OEM_ROUTES'
import router from '@/router'
import UserUrl from '@api/user/userUrl'
import UserApi from '@api/user'

export default {
  namespaced: true,
  state: {
    permissions: [],
    routes: [],
    supplierStatus: '',
    supplierStatusCode: '', // 供应商状态代码 0:审核中 1:已入驻 2:已冻结 3:已驳回
    supplierName: '',
    supplierId: '',
    userName: '',
    userId: '',
    isAdmin: false,
    confirmAgreement: false, // 是否确认了协议
    auditRemarks: null // 审核驳回备注
  },
  getters: {
    isInvalidStatusCode (state) {
      return ![0, 1, 2, 3].includes(state.supplierStatusCode)
    },
    isPassed (state) {
      return state.supplierStatusCode === 1
    },
    isRejected (state) {
      return state.supplierStatusCode === 3
    },
    isAuditting (state) {
      return state.supplierStatusCode === 0
    },
    enterMainPage (state, getters) {
      return state.confirmAgreement && getters.isPassed
    },
    enterRegisterPage (state, getters) {
      return !state.confirmAgreement && getters.isPassed
    },
    statusInfo (state) {
      return {
        confirmAgreement: state.confirmAgreement,
        supplierStatusCode: state.supplierStatusCode
      }
    }
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      if (userInfo === null || Object.keys(userInfo).length === 0) {
        state.permissions = []
        state.supplierStatus = ''
        state.supplierStatusCode = ''
        state.supplierName = ''
        state.supplierId = ''
        state.userName = ''
        state.userId = ''
        state.isAdmin = false
        state.confirmAgreement = false
        state.auditRemarks = null
        return
      }
      Object.keys(userInfo).forEach(key => {
        if (typeof userInfo[key] === 'object') {
          state[key] = JSON.parse(JSON.stringify(userInfo[key]))
        } else {
          state[key] = userInfo[key]
        }
      })
    },
    SET_ROUTES (state, routes) {
      state.routes = routes.length > 0 ? [...routes] : [...homeStaticRoutes]
    }
  },
  actions: {
    RESET_USER_DATA ({ commit }) {
      commit('SET_USER_INFO', {})
      commit('SET_ROUTES', [])
      removeCookie('token')
      removeCookie('userKey')
      removeSessionItem('supplierType')
    },
    AUTH_LOGIN ({ commit }, params) {
      return UserApi.authLogin(params).then((res) => {
        const { success, data } = res
        if (success) {
          setCookie('token', data.token)
          setCookie('userKey', data.userKey)
        }
        return res
      })
    },
    SIGN_OUT ({ commit, dispatch }) {
      return UserApi.logout().then((res) => {
        const { success } = res
        if (success) {
          dispatch('RESET_USER_DATA')
          return res
        }
      })
    },
    GET_USER_INFO ({ commit }) {
      return UserApi.getUserInfo().then((res) => {
        const { success, data } = res
        if (success) {
          commit('SET_USER_INFO', data)
          setSessionItem('supplierType', data.supplierType || 'ODM')
          return res
        }
      })
    },
    GET_ROUTES () {
      let routes = []
      const supplierType = getSessionItem('supplierType')
      if (supplierType === 'OEM') {
        routes = [...OEM_ROUTES]
      } else {
        routes = [...ODM_ROUTES]
      }
      return routes
    },
    async UPDATE_ROUTES ({ commit, dispatch }) {
      let dynamicRoute = {
        path: '/home',
        component: () => import('@/views/Home.vue'),
        children: []
      }
      let routes = await dispatch('GET_ROUTES')
      dynamicRoute.children = [...homeStaticRoutes, ...routes]
      router.$updateRoutes([dynamicRoute])
      commit('SET_ROUTES', dynamicRoute.children)
    },
    MODIFY_PASSWORD ({ commit }, params) {
      return UserApi.modifyPassword(params).then((res) => {
        const { success } = res
        if (success) {
          return res
        }
      })
    },
    RESET_PASSWORD ({ commit }, params) {
      return UserApi.resetPassword(params).then((res) => {
        const { success } = res
        if (success) {
          return res
        }
      })
    },
    DOWNLOAD_TEMPLATE ({ commit }) {
      downloadFile(UserUrl.payeePowerOfAttorney, '供应商收款委托书(RMB).docx')
    }
  }
}
