import url from './loginUrl'
import { get } from '@shared/http'

export function login (params) {
  return get(url.authLogin, params)
}
