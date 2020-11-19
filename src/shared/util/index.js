export const merge = require('lodash/merge')

export const getLang = function () {
  return localStorage.getItem('lang') || navigator.language || process.env.VUE_APP_LANG
}

export const setLang = function (lang) {
  localStorage.setItem('lang', lang)
}

export function isEmpty (value) {
  if (typeof value === 'string') {
    return value.trim() === ''
  }

  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length === 0
    } else {
      return JSON.stringify(value) === '{}'
    }
  }

  return false
}
