export * from './messageUI'
// json数据生成CSV文件
export * from './json2Csv'
// 下载文件
export * from './download'
export * from './browserStorage'
export * from './crypto'

export const merge = require('lodash/merge')

export const getLang = function () {
  return localStorage.getItem('lang') || process.env.VUE_APP_LANG || 'zh'
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

// 异步some函数
export const asyncSome = async (arr, predicate) => {
  for (let e of arr) {
    if (await predicate(e)) return true
  }
  return false
}
