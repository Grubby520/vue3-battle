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
    saleAttrsMap: {}, // 销售属性属性值Map
    checkedAttrs: [], // 已经选中的销售属性
    hasAttrsChanged: false, // 销售属性变动
    productMainAttributeAndTerm: {}, // 主属性
    categoryId: undefined, // 分类id
    mainAttributeType: '', // 主属性类型
    comparisonSaleAttrs: [], // 回显对比过的销售属性(已经删除和未删除的数据)
    disabledCategory: [] // 禁用的分类属性
  },
  getters: {
    specificationMain: state => state.mainAttributeType === 'specification',
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
    // saleAttrsMap: state => state.saleAttrsMap || {},
    saleAttrs: (state) => {
      // 所有销售属性
      return state.categoryData
        .filter(attr =>
          attr.saleAttributeType && [1, 2, 3].includes(attr.saleAttributeType.value)
        ) || []
    },
    saleAttrsMap: (state, getters) => {
      const curMap = new Map()
      const mode = state.productParams.mode
      let saleTerms = []
      if (mode === 'create') {
        saleTerms = getters.saleAttrs.map((item) => item.terms).flat()
      } else {
        // 回显处理好的销售属性值
        saleTerms = state.comparisonSaleAttrs.map((item) => item.terms).flat()
      }
      saleTerms.forEach(item => {
        curMap.set(item.id, item.name)
      })

      return curMap
    },
    checkedAttrs: state => state.checkedAttrs || [],
    hasAttrsChanged: state => state.hasAttrsChanged,
    productMainAttributeAndTerm: state => state.productMainAttributeAndTerm || {},
    categoryId: (state) => {
      return state.productBase.categoryId
    },
    comparisonSaleAttrs: state => state.comparisonSaleAttrs,
    disabledCategory: state => state.disabledCategory
  },
  mutations: {
    CATEGORY_DATA: (store, data) => {
      store.categoryData = data
    },
    SET_MAIN_ATTRIBUTE_TYPE (state, type) {
      state.mainAttributeType = type
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
      const clearAttrs = [
        'productBase',
        'productCustomAttributes',
        'productSalesAttributeDetail',
        'productImages',
        'productSize',
        'checkedSizes',
        'categoryData',
        'comparisonSaleAttrs'
      ]
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
    },
    PRODUCT_MAIN_ATTRIBUTE_AND_TERM (state, data) {
      state.productMainAttributeAndTerm = data
    },
    COMPARISON_SALE_INFO (state, data) {
      state.comparisonSaleAttrs = data
    },
    DISABLED_CATEGORY (state, data) {
      state.disabledCategory = data
    }
  },
  actions: {}
}
