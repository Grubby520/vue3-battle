import { post } from '@shared/http'
import URL from './userUrl'

const USER_API = {
  authLogin: (params) => post(URL.authLogin, params),
  modifyPassword: (params) => post(URL.modifyPassword, params),
  register: (params) => post(URL.register, params)
}

export default USER_API
