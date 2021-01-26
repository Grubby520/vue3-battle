export default {
  namespaced: true,
  state: {
    // 创建产品需要的所有参数
    productParams: null,
    sizeAttr: {},
    // 回显基本属性
    productbasic: [],
    // 回显商品属性
    productCustomAttributes: [],
    // 回显销售属性
    productSalesAttributeDetailVO: [],
    // 回显图片
    productImages: [],
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
    productbasic: state => state.productbasic || [],
    productCustomAttributes: state => state.productCustomAttributes || [],
    productSalesAttributeDetailVO: state => state.productSalesAttributeDetailVO || [],
    productImagesIInfo: state => state.productImages || [],
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
    PRODUCTBASIC: (store, data) => {
      store.productbasic = data
    },
    PRODUCTCUSTOMATTRIBUTES: (store, data) => {
      store.productCustomAttributes = data
    },
    PRODUCTSALESATTRIBUTEDETAILVO: (store, data) => {
      store.productSalesAttributeDetailVO = data
    },
    PRODUCTIMAGES: (store, data) => {
      store.productImages = data
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
