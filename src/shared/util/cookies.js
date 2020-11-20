import Cookies from 'js-cookie'

export function setCookie (name, value, config = {}) {
  Cookies.set(name, value, config)
}

export function getCookie (name, config = {}) {
  Cookies.get(name, config)
}

export function removeCookie (name) {
  Cookies.remove(name)
}
