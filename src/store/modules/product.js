export default {
  namespaced: true,
  state: {
    // 创建产品需要的所有参数
    productParams: null,
    sizeAttr: [],
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
    // 选中尺寸
    checkedSizes: [],
    // 品类商品属性
    customAttributesData: [],
    showSaleLabel: {},
    // 分类数据
    categoryData: [],
    specificationsAndSizes: [],
    saleAttrsMap: {},
    checkedAttrs: {}, // 已经选中的销售属性
    hasAttrsChanged: false // 销售属性变动
  },
  getters: {
    productParams: state => state.productParams || {},
    checkedSizes: state => state.checkedSizes,
    productBase: state => state.productBase || [],
    productCustomAttributes: state => state.productCustomAttributes || [],
    productSalesAttributeDetail: state => state.productSalesAttributeDetail || [],
    productImagesIInfo: state => state.productImages || [],
    productSize: state => state.productSize || [],
    sizeAttr: state => state.sizeAttr || [],
    sizeStandard: (state, getters) => getters.categoryData.find(categoryItem => categoryItem.extendCode === 'NZ013') || {},
    customAttributesData: state => state.customAttributesData || [],
    showSaleLabel: state => state.showSaleLabel || {},
    categoryData: state => state.categoryData || [],
    specificationsAndSizes: state => state.specificationsAndSizes || [],
    saleAttrsMap: state => state.saleAttrsMap || {},
    saleAttrs: (state) => {
      return state.categoryData
        .filter(attr =>
          attr.saleAttributeType && [1, 2, 3].includes(attr.saleAttributeType.value)
        ) || []
    }
  },
  mutations: {
    CATEGORY_DATA: (store, data) => {
      store.categoryData = data
      const saleAttrs = data.filter(cate => {
        if (cate.saleAttributeType) {
          return [1, 2, 3].includes(cate.saleAttributeType.value)
        }
      })
      const arr = saleAttrs.map((item) => item.terms).flat()
      const curMap = new Map()
      arr.forEach(item => {
        curMap.set(item.id, item.name)
      })
      store.saleAttrsMap = curMap
    },
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
    CUSTOM_ATTRIBUTES_DATA: (store, data) => {
      store.customAttributesData = data
    },
    SHOW_SALE_LABEL: (store, data) => {
      store.showSaleLabel = data
    },
    REMOVE_STASH_ATTRS: (store, data) => {
      const clearAttrs = ['productBase', 'productCustomAttributes', 'productSalesAttributeDetail', 'productImages', 'productSize', 'checkedSizes', 'categoryData']
      clearAttrs.forEach(attr => {
        store[attr] = data
      })
    },
    SPECIFICATIONS_AND_SIZES: (store, data) => {
      store.specificationsAndSizes = data
    },
    SET_CHECKED_ATTRS (state, payload) {
      state.checkedAttrs = payload
    },
    SET_ATTRS_CHANGED (state) {
      state.hasAttrsChanged = !state.hasAttrsChanged
    }
  },
  actions: {}
}
