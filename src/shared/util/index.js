export * from './messageUI'
// json数据生成CSV文件
export * from './json2Csv'
// 下载文件
export * from './download'

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
