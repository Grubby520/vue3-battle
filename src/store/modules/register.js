export default {
  namespaced: true,
  state: {
    application: {},
    additionalInfo: {}
  },
  getters: {

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
