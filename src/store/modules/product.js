export default {
  namespaced: true,
  state: {
    productParams: null,
    categoryInfo: null,
    sizeOptions: []
  },
  getters: {
    productParams: (state) => state.productInfo ? state.productInfo : {},
    // categoryInfo: (state) => state.categoryInfo,
    sizeOptions: (state) => state.sizeOptions
  },
  mutations: {
    PRODUCT_PARAMS: (store, data) => {
      store.productInfo = data
    },
    // CATEGORY_DATA: (store, data) => {
    //   store.categoryInfo = data
    // },
    SIZEOPTIONS: (store, data) => {
      store.sizeOptions = data
    }
  },
  actions: {
    // 设置上传Spu数据结果
    // setImportSpuResultData: ({ commit }, resultData) => {
    //   commit('IMPORT_SPU_RESULT_DATA', resultData)
    // }
  }
}
