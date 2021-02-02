export default {
  namespaced: true,
  state: {
    // 创建产品需要的所有参数
    productParams: null,
    sizeAttr: {},
    // 回显基本属性
    productBase: [],
    // 回显商品属性
    productCustomAttributes: [],
    // 回显销售属性
    productSalesAttributeDetailVO: [],
    // 回显图片
    productImages: [],
    // 回显尺码表
    productsize: [],
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
    productParams: state => state.productParams || {},
    sizeOptions: state => state.sizeOptions,
    productBase: state => state.productBase || [],
    productCustomAttributes: state => state.productCustomAttributes || [],
    productSalesAttributeDetailVO: state => state.productSalesAttributeDetailVO || [],
    productImagesIInfo: state => state.productImages || [],
    productsize: state => state.productsize || [],
    sizeAttr: state => state.sizeAttr || {},
    saleAttrNone: state => state.saleAttrNone === 0,
    sizestandard: state => state.sizestandard || [],
    customAttributesData: state => state.customAttributesData || []
  },
  mutations: {
    PRODUCT_PARAMS: (store, data) => {
      store.productParams = data
    },
    SIZEOPTIONS: (store, data) => {
      store.sizeOptions = data
    },
    SIZEATTR: (store, data) => {
      store.sizeAttr = data
    },
    productBase: (store, data) => {
      store.productBase = data
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
    PRODUCTSIZE: (store, data) => {
      store.productsize = data
    },
    SALEATTRNONE: (store, data) => {
      store.saleAttrNone = data
    },
    SIZESTANDARD: (store, data) => {
      store.sizestandard = data
    },
    CUSTOMATTRIBUTESDATA: (store, data) => {
      store.customAttributesData = data
    },
    REMOVESTASHATTRS: (store, data) => {
      store.productBase = [store.cateLabels]
      store.productCustomAttributes = data
      store.productSalesAttributeDetailVO = data
      store.productImages = data
      store.productsize = data
    }
  },
  actions: {}
}
