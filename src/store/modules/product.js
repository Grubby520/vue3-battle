export default {
  namespaced: true,
  state: {
    // 创建产品需要的所有参数
    productParams: null,
    sizeAttr: {},
    // 回显基本属性
    productBasicInfo: [],
    // 回显商品属性
    productCustomizeAttributeList: [],
    // 回显销售属性
    productSalesAttributeList: [],
    // 品类上未绑定销售属性
    saleAttrNone: undefined,
    // 品类绑定的尺寸
    sizeOptions: [],
    // 品类绑定标准属性
    sizestandard: [],
    // 品类商品属性
    customAttributesData: []
  },
  getters: {
    productParams: state => state.productInfo ? state.productInfo : {},
    sizeOptions: state => state.sizeOptions,
    productBasicInfo: state => state.productBasicInfo || [],
    productCustomizeAttributeList: state => state.productCustomizeAttributeList || [],
    productSalesAttributeList: state => state.productSalesAttributeList || [],
    sizeAttr: state => state.sizeAttr || {},
    saleAttrNone: state => state.saleAttrNone === 0,
    sizestandard: state => state.sizestandard || [],
    customAttributesData: state => state.customAttributesData || []
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
    },
    CUSTOMATTRIBUTESDATA: (store, data) => {
      store.customAttributesData = data
    }
  },
  actions: {}
}
