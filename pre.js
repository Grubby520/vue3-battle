const fs = require('fs')
const path = require('path')
const process = require('process')

function dateFormat (date, format) {
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

let version = require('./package.json').version
let filePath
if (process.argv[2]) {
  version = version + '-' + process.argv[2]
}
version += '-' + dateFormat(new Date(), 'yy.MM.dd-hhmm')

filePath = path.join(__dirname, 'public/version.json')
fs.writeFile(filePath, '{"version": "' + version + '"}', () => { })
