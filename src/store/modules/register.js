import { valueToMd5 } from '@shared/util'

export default {
  namespaced: true,
  state: {
    supplierId: '',
    application: {},
    additionalInfo: {
      currency: 0 // 默认人民币
    }
  },
  getters: {
    certificationNo (state) {
      return state.application.certificationNo
    },
    getSubmitData (state) {
      let baseInfo = {}
      let bankInfo = {}
      let certification = {}
      let getHandledPictureUrl = function (image) {
        if (!image) {
          return ''
        }
        // 图片链接'?'后面跟的认证信息,保存时需要去掉
        return image.src ? image.src.split('?')[0] : image.src
      }
      // 基本信息转换
      let excludeKeys = ['certificationNo', 'confirmPassword']
      Object.keys(state.application).forEach(key => {
        if (!excludeKeys.includes(key)) {
          baseInfo[key] = state.application[key]
          if (key === 'address') {
            baseInfo[key] = JSON.stringify(state.application[key])
          }

          if (key === 'password' && state.application[key]) {
            baseInfo[key] = valueToMd5(state.application[key])
          }

          // if (key === 'shopLink' && state.application[key]) {
          //   baseInfo[key] = valueToListByEnter(state.application[key])
          // }
        }
      })
      // 银行信息转换
      let bankKeys = ['currency', 'payeeCompany', 'payee', 'payeeIdCard', 'payeePhone', 'bank', 'bankBranch', 'bankAccount', 'bankCity']
      Object.keys(state.additionalInfo).forEach(key => {
        if (bankKeys.includes(key)) {
          bankInfo[key] = state.additionalInfo[key]
        }
        if (key === 'bankCity') {
          bankInfo[key] = JSON.stringify(state.additionalInfo[key])
        }
      })
      // 资质信息转换
      certification['certificationNo'] = state.application.certificationNo
      certification['certificationImage'] = getHandledPictureUrl(state.additionalInfo.certificationImage[0])
      certification['payeeDelegationImage'] = getHandledPictureUrl(state.additionalInfo.payeeDelegationImage[0])
      certification['idCardFront'] = getHandledPictureUrl(state.additionalInfo.idCardImages[0])
      certification['idCardBack'] = getHandledPictureUrl(state.additionalInfo.idCardImages[1])
      certification['payeeIdCardFront'] = getHandledPictureUrl(state.additionalInfo.payeeIdCardImages[0])
      certification['payeeIdCardBack'] = getHandledPictureUrl(state.additionalInfo.payeeIdCardImages[1])
      certification['organizationImage'] = getHandledPictureUrl(state.additionalInfo.organizationImage[0])
      certification['taxRegisterImage'] = getHandledPictureUrl(state.additionalInfo.taxRegisterImage[0])
      certification['companyShareholderImage'] = getHandledPictureUrl(state.additionalInfo.companyShareholderImage[0])

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
        cooperationCompanies: [],
        userName: '',
        password: '',
        confirmPassword: '',
        contactName: '',
        contactNumber: '',
        contactQq: '',
        selfShop: null, // 是否自有1688店铺
        shopLink: null, // 1688店铺链接
        contactWebChat: '', // 联系微信
        referrer: '' // 联系微信
      }

      state.additionalInfo = {
        currency: 0, // 默认人民币
        payeeCompany: '',
        payee: '',
        payeeIdCard: '',
        payeePhone: '',
        bank: '',
        bankBranch: '',
        bankCity: '',
        bankAccount: '',
        idCardImages: [],
        certificationImage: [],
        payeeDelegationImage: [],
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
