import { passwordReg } from './regular.js'

export function generateFormItemValidator (regex, errorMsg) {
  return (rule, value, callback) => {
    if (!regex.test(value)) {
      callback(new Error(errorMsg))
    } else {
      callback()
    }
  }
}

export const passwordValidator = generateFormItemValidator(passwordReg, '请输入8-20位字符')
