import { valueToMd5 } from '@shared/util'

export default {
  namespaced: true,
  state: {
    supplierId: '',
    application: {},
    additionalInfo: {}
  },
  getters: {
    certificationNo (state) {
      return state.application.certificationNo
    },
    getSubmitData (state) {
      let baseInfo = {}
      let bankInfo = {}
      let certification = {}
      // 基本信息转换
      let excludeKeys = ['certificationNo', 'confirmPassword']
      Object.keys(state.application).forEach(key => {
        if (!excludeKeys.includes(key)) {
          baseInfo[key] = state.application[key]
          if (key === 'address') {
            baseInfo[key] = JSON.stringify(state.application[key])
          }

          if (key === 'password') {
            baseInfo[key] = valueToMd5(state.application[key])
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
    RESET_REGISTER_DATA (state) {
      state.supplierId = ''
      state.application = {
        supplierName: '',
        certificationNo: '', // 营业执照号
        supplyType: null, // 公司性质
        address: [],
        tradeType: [],
        annualTurnoverAmount: null, // 年营业额
        selfFactory: null, // 是否自有工厂
        factoryDescription: '', // 工厂实力
        advantage: '',
        userName: '',
        password: '',
        confirmPassword: '',
        contactName: '',
        contactNumber: '',
        contactQq: ''
      }

      state.additionalInfo = {
        currency: null,
        payeeCompany: '',
        payee: '',
        payeeIdCard: '',
        payeePhone: '',
        unionPayNo: '',
        bank: '',
        bankBranch: '',
        bankAccount: '',
        idCardImages: [],
        certificationImage: [],
        organizationImage: [],
        taxRegisterImage: [],
        companyShareholderImage: []
      }
    },
    SET_APPLICATION (state, application) {
      state.application = application
    },
    SET_ADDITIONAL_INFO (state, additionalInfo) {
      state.additionalInfo = additionalInfo
    },
    SET_SUPPLIER_ID (state, supplierId) {
      state.supplierId = supplierId
    }
  },
  actions: {

  }
}
