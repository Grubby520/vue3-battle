import { post } from '@shared/http'
import URL from './loginUrl'

const LOGIN_API = {
  authLogin: (params) => post(URL.authLogin, params)
}

export default LOGIN_API
