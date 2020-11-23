import { get, post } from '@shared/http'
import URL from './userUrl'

const USER_API = {
  authLogin: (params) => post(URL.authLogin, params),
  modifyPassword: (params) => post(URL.modifyPassword, params),
  register: (params) => post(URL.register, params),
  getUserInfo: () => get(URL.userInfo),
  logout: () => get(URL.logout, {}, { addLoading: true }),
  docDetails: () => get(URL.docDetails),
  docModify: (params) => post(URL.docModify, params)
}

export default USER_API
