export default {
  namespaced: true,
  state: {
    // 导入Spu数据结果
    importSpuResultData: null
  },
  getters: {
    // 上传Spu数据结果
    importSpuResultData: (state) => state.importSpuResultData
  },
  mutations: {
    // Spu数据结果
    IMPORT_SPU_RESULT_DATA: (store, resultData) => {
      store.importSpuResultData = resultData
    }
  },
  actions: {
    // 设置上传Spu数据结果
    setImportSpuResultData: ({ commit }, resultData) => {
      commit('IMPORT_SPU_RESULT_DATA', resultData)
    }
  }
}
