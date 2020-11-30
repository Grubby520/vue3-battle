export const passwordReg = /[A-Za-z0-9!@#$%^&*?()_-]{8,20}/
export const phoneNoReg = /^((\+86)?(13\d|14[5-9]|15[0-35-9]|16[25-7]|17[0-8]|18\d|19[0-25-9])\d{8})$/
export const numberReg = /^[0-9]+$/
export const letterReg = /^[A-Za-z]+$/
export const wordCharacterReg = /^\w+$/
// 0-999999.99
export const smallReg = /^((([^0][0-9]+|0)\.([0-9]{1,6}))$)|^(([1-9]+)\.([0-9]{1,2})$)/
// 营业执照号15位或18位
export const businessLicenseNoReg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/
