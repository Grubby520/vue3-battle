import { setCookie } from '@shared/util'
import UserApi from '@api/user'

export default {
  namespaced: true,
  state: {
    permissions: [],
    statusName: '1',
    supplierName: 'string',
    userName: 'string'
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    AUTH_LOGIN ({ state }, params) {
      return UserApi.authLogin(params).then((res) => {
        const { success, data } = res
        if (success) {
          setCookie('token', data.token)
          setCookie('userKey', data.userKey)
          return res
        }
      })
    },
    SIGN_OUT () {

    }
  }
}
