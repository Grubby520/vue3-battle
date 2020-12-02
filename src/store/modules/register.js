import { valueToMd5 } from '@shared/util'

export default {
  namespaced: true,
  state: {
    application: {},
    additionalInfo: {}
  },
  getters: {
    getSubmitData (state) {
      let baseInfo = {}
      let bankInfo = {}
      let certification = {}
      // 基本信息转换
      let excludeKeys = ['certificationNo', 'confirmPassword']
      Object.keys(state.application).forEach(key => {
        if (!excludeKeys.includes(key)) {
          if (Array.isArray(state.application[key])) {
            baseInfo[key] = JSON.stringify(state.application[key])
          } else {
            baseInfo[key] = state.application[key]
            if (key === 'password') {
              baseInfo[key] = valueToMd5(state.application[key])
            }
          }
        }
      })
      // 银行信息转换
      let bankKeys = ['currency', 'payeeCompany', 'payee', 'payeeIdCard', 'payeePhone', 'unionPayNo', 'bank', 'bankBranch', 'bankAccount']
      Object.keys(state.additionalInfo).forEach(key => {
        if (bankKeys.includes(key)) {
          bankInfo[key] = state.additionalInfo[key]
        }
      })
      // 资质信息转换
      certification['certificationNo'] = state.application.certificationNo
      certification['certificationImage'] = state.additionalInfo.certificationImage[0] ? state.additionalInfo.certificationImage[0].url : ''
      certification['idCardFront'] = state.additionalInfo.idCardImages[0] ? state.additionalInfo.idCardImages[0].url : ''
      certification['idCardBack'] = state.additionalInfo.idCardImages[1] ? state.additionalInfo.idCardImages[1].url : ''
      certification['organizationImage'] = state.additionalInfo.organizationImage[0] ? state.additionalInfo.organizationImage[0].url : ''
      certification['taxRegisterImage'] = state.additionalInfo.taxRegisterImage[0] ? state.additionalInfo.taxRegisterImage[0].url : ''
      certification['companyShareholderImage'] = state.additionalInfo.companyShareholderImage[0] ? state.additionalInfo.companyShareholderImage[0].url : ''

      return {
        baseInfo,
        certification,
        bankInfo
      }
    }
  },
  mutations: {
    SET_APPLICATION (state, application) {
      state.application = application
    },
    SET_ADDITIONAL_INFO (state, additionalInfo) {
      state.additionalInfo = additionalInfo
    }
  },
  actions: {

  }
}
