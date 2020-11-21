const baseURL = 'http://10.250.1.7:9100/user-service/'

export default {
  authLogin: baseURL + 'auth/login',
  modifyPassword: baseURL + 'user/password/modify',
  register: baseURL + 'user/register'
}
