import { setCookie, removeCookie, downloadFile } from '@shared/util'
import UserUrl from '@api/user/userUrl'
import UserApi from '@api/user'

export default {
  namespaced: true,
  state: {
    permissions: [],
    supplierStatus: '',
    supplierStatusCode: '', // 供应商状态代码 0：待审核 1：审核中 2：试版中 3：已准入 5：未通过
    supplierName: '',
    supplierId: '',
    userName: '',
    userId: '',
    isAdmin: false,
    confirmAgreement: false // 是否确认了协议
  },
  getters: {
    enterMainPage (state) {
      return (state.confirmAgreement && state.supplierStatusCode === 2) || state.supplierStatusCode === 3
    },
    enterRegisterPage (state) {
      return !state.confirmAgreement && state.supplierStatusCode === 2
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
      removeCookie('token')
      removeCookie('userKey')
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
    },
    DOWNLOAD_TEMPLATE ({ commit }) {
      downloadFile(UserUrl.payeePowerOfAttorney, '供应商收款委托书(RMB).docx')
    }
  }
}
