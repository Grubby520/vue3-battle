import { passwordReg, phoneNoReg } from './regular.js'

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
export const phoneNoValidator = generateFormItemValidator(phoneNoReg, '请输入正确格式手机号码')
