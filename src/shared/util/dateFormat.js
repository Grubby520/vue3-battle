import { forEach as _forEach } from 'lodash'

const DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4, 0, false, true),
  yy: dateGetter('FullYear', 2, 0, true, true),
  MM: dateGetter('Month', 2, 1),
  M: dateGetter('Month', 1, 1),
  dd: dateGetter('Date', 2),
  d: dateGetter('Date', 1),
  HH: dateGetter('Hours', 2),
  H: dateGetter('Hours', 1),
  hh: dateGetter('Hours', 2, -12),
  h: dateGetter('Hours', 1, -12),
  mm: dateGetter('Minutes', 2),
  m: dateGetter('Minutes', 1),
  ss: dateGetter('Seconds', 2),
  s: dateGetter('Seconds', 1)
}

function padNumber (num, digits, trim, negWrap) {
  let neg = ''
  if (num < 0 || (negWrap && num <= 0)) {
    if (negWrap) {
      num = -num + 1
    } else {
      num = -num
      neg = '-'
    }
  }
  num = '' + num
  while (num.length < digits) num = '0' + num
  if (trim) {
    num = num.substr(num.length - digits)
  }
  return neg + num
}

function dateGetter (name, size, offset, trim, negWrap) {
  offset = offset || 0
  return function (date) {
    let value = date['get' + name]()
    if (offset > 0 || value > -offset) {
      value += offset
    }
    if (value === 0 && offset === -12) value = 12
    return padNumber(value, size, trim, negWrap)
  }
}

export function date (val, format) {
  let DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/
  let text = ''
  let parts = []
  let fn
  let match
  let date = val
  if (typeof val === 'string') {
    date = parseInt(val, 10)
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  while (format) {
    match = DATE_FORMATS_SPLIT.exec(format)
    if (match) {
      parts = parts.concat([].slice.call(match, 1))
      format = parts.pop()
    } else {
      parts.push(format)
      format = null
    }
  }
  _forEach(parts, function (value) {
    fn = DATE_FORMATS[value]
    if (fn) {
      text += fn(date)
    } else {
      text += value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'')
    }
  })
  return text
}

// element-日期组件使用
export const datePickerOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '昨天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近15天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近30天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近90天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
}
