export const merge = require('lodash/merge')

export const getLang = function () {
  return localStorage.getItem('lang') || navigator.language || process.env.VUE_APP_LANG
}

export const setLang = function (lang) {
  localStorage.setItem('lang', lang)
}
