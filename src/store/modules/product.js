export default {
  namespaced: true,
  state: {
    // 创建产品需要的所有参数
    productParams: null,
    sizeAttr: null,
    // 回显基本属性
    productBase: [],
    // 回显商品属性
    productCustomAttributes: [],
    // 回显销售属性
    productSalesAttributeDetail: null,
    // 回显图片
    productImages: [],
    // 回显尺码表
    productSize: [],
    // 品类上未绑定销售属性
    noSaleAttributes: undefined,
    // 选中尺寸
    checkedSizes: [],
    // 品类绑定标准属性
    sizeStandard: null,
    // 品类商品属性
    customAttributesData: []
  },
  getters: {
    productParams: state => state.productParams || {},
    checkedSizes: state => state.checkedSizes,
    productBase: state => state.productBase || [],
    productCustomAttributes: state => state.productCustomAttributes || [],
    productSalesAttributeDetail: state => state.productSalesAttributeDetail || [],
    productImagesIInfo: state => state.productImages || [],
    productSize: state => state.productSize || [],
    sizeAttr: state => state.sizeAttr || {},
    noSaleAttributes: state => state.noSaleAttributes === 0,
    sizeStandard: state => state.sizeStandard || {},
    customAttributesData: state => state.customAttributesData || []
  },
  mutations: {
    PRODUCT_PARAMS: (store, data) => {
      store.productParams = data
    },
    CHECKED_SIZES: (store, data) => {
      store.checkedSizes = data
    },
    SIZE_ATTR: (store, data) => {
      store.sizeAttr = data
    },
    PRODUCT_BASE: (store, data) => {
      store.productBase = data
    },
    PRODUCT_CUSTOM_ATTRIBUTES: (store, data) => {
      store.productCustomAttributes = data
    },
    PRODUCT_SALES_ATTRIBUTE_DETAIL: (store, data) => {
      store.productSalesAttributeDetail = data
    },
    PRODUCT_IMAGES: (store, data) => {
      store.productImages = data
    },
    PRODUCT_SIZE: (store, data) => {
      store.productSize = data
    },
    NO_SALE_ATTRIBUTES: (store, data) => {
      store.noSaleAttributes = data
    },
    SIZE_STANDARD: (store, data) => {
      store.sizeStandard = data
    },
    CUSTOM_ATTRIBUTES_DATA: (store, data) => {
      store.customAttributesData = data
    },
    REMOVE_STASH_ATTRS: (store, data) => {
      store.productBase = [store.cateLabels]
      store.productCustomAttributes = data
      store.productSalesAttributeDetail = data
      store.productImages = data
      store.productSize = data
    }
  },
  actions: {}
}
