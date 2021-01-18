export default {
  namespaced: true,
  state: {
    productParams: null,
    sizeOptions: [],
    productBasicInfo: [],
    productCustomizeAttributeList: [],
    productSalesAttributeList: []
  },
  getters: {
    productParams: (state) => state.productInfo ? state.productInfo : {},
    sizeOptions: (state) => state.sizeOptions,
    productBasicInfo: (state) => state.productBasicInfo || [],
    productCustomizeAttributeList: (state) => state.productCustomizeAttributeList || [],
    productSalesAttributeList: (state) => state.productSalesAttributeList || []
  },
  mutations: {
    PRODUCT_PARAMS: (store, data) => {
      store.productInfo = data
    },
    SIZEOPTIONS: (store, data) => {
      store.sizeOptions = data
    },
    PRODUCTBASICINFO: (store, data) => {
      store.productBasicInfo = data
    },
    PRODUCTCUSTOMIZEATTRIBUTELIST: (store, data) => {
      store.productCustomizeAttributeList = data
    },
    PRODUCTSALESATTRIBUTELIST: (store, data) => {
      store.productSalesAttributeList = data
    }

    // PRODUCTIMAGES: (store, data) => {
    //   store.productimages = data
    // }
  },
  actions: {
    // 设置上传Spu数据结果
    // setImportSpuResultData: ({ commit }, resultData) => {
    //   commit('IMPORT_SPU_RESULT_DATA', resultData)
    // }
  }
}
