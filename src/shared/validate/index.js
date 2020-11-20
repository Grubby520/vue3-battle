import { isEmpty } from '@shared/util'
import { passwordReg, phoneNoReg, numberReg } from './regular.js'

/**
 * 生成验证器
 * @param {RegExp|Function} validateRule 正则或者函数
 * @param {String} errorMsg 错误提示
 */
export function generateFormItemValidator (validateRule, errorMsg) {
  return (rule, value, callback) => {
    let isFailed = typeof validateRule === 'object' ? !validateRule.test(value) : validateRule(value)
    if (isFailed) {
      callback(new Error(errorMsg))
    } else {
      callback()
    }
  }
}

/**
 * 函数验证器
 * @param {String} errorMsg 错误消息
 * @param {Function} fn 判断数据错误的方法,返回Boolean类型
 * @param {String|Array} trigger 触发方式
 */
export const fnValidator = function (errorMsg, fn, trigger = 'blur') {
  return {
    validator: generateFormItemValidator(fn),
    message: errorMsg,
    trigger: trigger
  }
}

export const emptyValidator = function (errorMsg, trigger = 'blur') {
  return {
    validator: (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error(errorMsg))
      } else {
        callback()
      }
    },
    message: errorMsg,
    trigger: trigger
  }
}

export const charLimitValidator = function (errorMsg, min, max, trigger = 'blur') {
  return {
    min,
    max,
    message: errorMsg,
    trigger: trigger
  }
}

export const passwordValidator = function (errorMsg = '请输入8-20位字符', trigger = 'blur') {
  return {
    validator: generateFormItemValidator(passwordReg, errorMsg),
    message: errorMsg,
    trigger: trigger
  }
}

export const phoneNoValidator = function (errorMsg = '请输入正确格式手机号码', trigger = 'blur') {
  return {
    validator: generateFormItemValidator(phoneNoReg, errorMsg),
    message: errorMsg,
    trigger: trigger
  }
}
export const numberValidator = function (errorMsg = '请输入0-9999之间的数字', trigger = 'blur') {
  return {
    validator: generateFormItemValidator(numberReg, errorMsg),
    message: errorMsg,
    trigger: trigger
  }
}
