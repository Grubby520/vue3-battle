export default {
  namespaced: true,
  state: {
    productParams: null,
    sizeOptions: [],
    sizeAttr: {},
    productBasicInfo: [],
    productCustomizeAttributeList: [],
    productSalesAttributeList: [],
    saleAttrNone: undefined,
    sizestandard: []
  },
  getters: {
    productParams: state => state.productInfo ? state.productInfo : {},
    sizeOptions: state => state.sizeOptions,
    productBasicInfo: state => state.productBasicInfo || [],
    productCustomizeAttributeList: state => state.productCustomizeAttributeList || [],
    productSalesAttributeList: state => state.productSalesAttributeList || [],
    sizeAttr: state => state.sizeAttr || {},
    saleAttrNone: state => state.saleAttrNone === 0,
    sizestandard: state => state.sizestandard || []
  },
  mutations: {
    PRODUCT_PARAMS: (store, data) => {
      store.productInfo = data
    },
    SIZEOPTIONS: (store, data) => {
      store.sizeOptions = data
    },
    SIZEATTR: (store, data) => {
      store.sizeAttr = data
    },
    PRODUCTBASICINFO: (store, data) => {
      store.productBasicInfo = data
    },
    PRODUCTCUSTOMIZEATTRIBUTELIST: (store, data) => {
      store.productCustomizeAttributeList = data
    },
    PRODUCTSALESATTRIBUTELIST: (store, data) => {
      store.productSalesAttributeList = data
    },
    SALEATTRNONE: (store, data) => {
      store.saleAttrNone = data
    },
    SIZESTANDARD: (store, data) => {
      store.sizestandard = data
    }
  },
  actions: {
    // 设置上传Spu数据结果
    // setImportSpuResultData: ({ commit }, resultData) => {
    //   commit('IMPORT_SPU_RESULT_DATA', resultData)
    // }
  }
}
