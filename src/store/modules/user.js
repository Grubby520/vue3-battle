import { setSessionItem, removeSessionItem } from '@shared/util'
import UserApi from '@api/user'

export default {
  namespaced: true,
  state: {
    permissions: [],
    supplierStatus: '',
    supplierStatusCode: '',
    supplierName: '小王极简主义传媒有限公司',
    userName: '',
    isAdmin: false
  },
  getters: {

  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.permissions = userInfo.permissions
      state.supplierStatus = userInfo.supplierStatus
      state.supplierStatusCode = userInfo.supplierStatusCode
      state.supplierName = userInfo.supplierName
      state.userName = userInfo.userName
      state.isAdmin = userInfo.isAdmin
    }
  },
  actions: {
    AUTH_LOGIN ({ state }, params) {
      return UserApi.authLogin(params).then((res) => {
        const { success, data } = res
        if (success) {
          setSessionItem('token', data.token)
          setSessionItem('userKey', data.userKey)
        }
        return res
      })
    },
    SIGN_OUT ({ commit }) {
      return UserApi.logout().then((res) => {
        const { success } = res
        if (success) {
          commit('SET_USER_INFO', {})
          removeSessionItem('token')
          removeSessionItem('userKey')
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
