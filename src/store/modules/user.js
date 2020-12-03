import { setSessionItem, removeSessionItem } from '@shared/util'
import UserApi from '@api/user'

export default {
  namespaced: true,
  state: {
    permissions: [],
    supplierStatus: '',
    supplierStatusCode: '',
    supplierName: '小王极简主义传媒有限公司',
    supplierId: '',
    userName: '',
    isAdmin: false,
    confirmAgreement: false
  },
  getters: {

  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      if (userInfo === null && Object.keys(userInfo).length === 0) {
        state.permissions = []
        state.supplierStatus = ''
        state.supplierStatusCode = ''
        state.supplierName = ''
        state.supplierId = ''
        state.userName = ''
        state.isAdmin = false
        state.confirmAgreement = false
        return
      }
      Object.keys(userInfo).forEach(key => {
        if (typeof userInfo[key] === 'object') {
          state[key] = JSON.parse(JSON.stringify(userInfo[key]))
        } else {
          state[key] = userInfo[key]
        }
      })
    }
  },
  actions: {
    RESET_USER_DATA ({ commit }) {
      commit('SET_USER_INFO', {})
      removeSessionItem('token')
      removeSessionItem('userKey')
    },
    AUTH_LOGIN ({ commit }, params) {
      return UserApi.authLogin(params).then((res) => {
        const { success, data } = res
        if (success) {
          setSessionItem('token', data.token)
          setSessionItem('userKey', data.userKey)
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
          return res
        }
      })
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
    }
  }
}
