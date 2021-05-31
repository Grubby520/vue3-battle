<template>
  <div class="product">
    <el-alert
      v-if="productStatus===6&&auditRejectReason"
      :title="`侵权审核不通过 原因：${auditRejectReason}`"
      type="error"
    ></el-alert>
    <template>
      <div
        v-loading="loading"
        v-for="component in productComponents"
        :key="component"
        :class="{'view-container': isStatus}"
      >
        <component :is="component" :ref="component" />
      </div>
    </template>
    <div class="product-btn">
      <div v-if="mode!=='view'">
        <el-button type="primary" @click="create">保存</el-button>
        <el-button type="primary" v-if="productStatus !== 3" @click="saveSubmit">提交</el-button>
        <el-button type="primary" v-if="productStatus === 3" @click="replenish">确定补充信息</el-button>
      </div>
      <el-button @click="cancel" style="margin-left:1rem;">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import ProductBase from './ProductBase'
import ProductAttr from './ProductAttr'
import ProductColorMain from './ColorMain/Index'
import ProductSpecificationMain from './SpecificationMain/SkuInfo'
import ProductSize from './ProductSize'
import ProductImages from './ProductImages'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import { mapGetters } from 'vuex'
import { isEmpty, deepClone } from '@shared/util'
export default {
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: [String, Number], required: false, default: '' },
    // 分类Id
    categoryId: {
      type: [String, Number],
      default: ''
    },
    categoryPath: { type: String, required: false, default: '' },
    cateLabels: { type: String, required: false, default: '' },
    supplierItemNo: { type: String, required: false, default: '' }
  },
  components: {
    ProductSize,
    ProductColorMain,
    ProductAttr,
    ProductBase,
    ProductImages,
    ProductSpecificationMain
  },
  data () {
    return {
      auditRejectReason: '',
      productStatus: undefined,
      loading: false,
      mainAttributeType: ''
    }
  },
  watch: {
    '$props': {
      handler () {
        this.$store.commit('product/PRODUCT_PARAMS', this.$props)
        this.$store.commit('product/REMOVE_STASH_ATTRS', []) // 清除store里的缓存数据
      },
      immediate: true,
      deep: true
    },
    'categoryId': {
      handler (newValue) {
        if (newValue) {
          this.getCategoryAttr()
          if (this.mode !== 'create') {
            this.load()
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters('product', [
      'specificationMain',
      'saleAttrs',
      'productMainAttributeAndTerm',
      'productSalesAttributeDetail',
      'categoryData'
    ]),
    isStatus () {
      return this.mode === 'view'
    },
    productComponents () {
      const unapproveComponents = ['ProductBase', 'ProductImages']
      // 通过侵权审核展示尺码表和商品属性
      const passComponents = ['ProductBase', 'ProductImages', 'ProductSize', 'ProductAttr']
      const currentComponents = this.productStatus >= 3 ? passComponents : unapproveComponents
      const addComponents = this.specificationMain ? 'ProductSpecificationMain' : 'ProductColorMain'
      currentComponents.splice(2, 0, addComponents)
      return currentComponents
    },
    specification () {
      return this.saleAttrs.find(attr => attr.saleAttributeType && attr.saleAttributeType.value === 3) || {}
    },
    /**
    * 当前关联关系的sizeids
    */
    relationIds () {
      const {
        productCategorySalesAttributeSelectedList = []
      } = deepClone(this.productSalesAttributeDetail)
      return productCategorySalesAttributeSelectedList
        .filter(sale => sale.attribute.saleAttributeType === 2)
        .reduce((init, size) => {
          init.push(size.attribute.id)
          return init
        }, [])
    },
    /**
     * 回显数据的关联关系
     */
    categoryAttributeRelatedSizesInfo () {
      const {
        productMainAttributeAndTerm: { mainAttributeId, productMainAttributeTermRelationList = [] } = {},
        productCategorySalesAttributeSelectedList = []
      } = deepClone(this.productSalesAttributeDetail)
      return productMainAttributeTermRelationList.map(relation => {
        const { mainAttributeTermId, relatedAttributeAndTermList } = relation
        const relationSize = relatedAttributeAndTermList
          .find(term => this.relationIds.includes(term.attributeId))
        const saleSizeAttr = productCategorySalesAttributeSelectedList
          .find(attr => relationSize.attributeId === attr.attributeId)
        const saleSpecificationAttr = productCategorySalesAttributeSelectedList
          .filter(attr => mainAttributeId === attr.attributeId)
          .map(attr => {
            return attr.attributeTerms.find(term => term.id === mainAttributeTermId)
          })
        return {
          termId: mainAttributeTermId,
          relatedSizeId: relationSize.attributeId,
          termName: saleSpecificationAttr[0].name,
          relatedSizeName: saleSizeAttr.attribute.name
        }
      })
    },
    /**
     * 对比分类和回显数据，主属性没有变更的情况下，获取分类新添加的关联关系
     */
    categorySalesAttributeSelectedList () {
      const {
        productMainAttributeAndTerm: { mainAttributeId, productMainAttributeTermRelationList = [] } = {}
      } = deepClone(this.productSalesAttributeDetail)
      const { categoryAttributeRelatedSizes, mainAttribute, id } = this.specification
      let restCategoryRelated = []
      if (mainAttributeId === id && mainAttribute) {
        // 当前规格主属性没有变更
        const productMainAttributeTermRelationIds = productMainAttributeTermRelationList
          .reduce((init, term) => init.concat(term.mainAttributeTermId), [])
        restCategoryRelated = categoryAttributeRelatedSizes
          .filter(cate => !productMainAttributeTermRelationIds.includes(cate.termId))
      }
      return restCategoryRelated
    }
  },
  methods: {
    load () {
      const productAttrsRequest = RecommondApi.product(this.id)
      const categoryAttrsRequest = RecommondApi.plmCategoryAttrs(this.categoryId, { system: 2 })
      Promise.all([productAttrsRequest, categoryAttrsRequest])
        .then(responses => {
          this.loading = true
          responses.forEach((response, index) => {
            if (index === 0) {
              this.productAttrsInfo(response)
            } else if (index === 1) {
              this.categoryAttrs(response)
            }
          })
        }).finally(() => {
          this.loading = false
        })
    },
    productAttrsInfo (response) {
      const {
        productBase,
        productCustomAttributes,
        productImages,
        productSalesAttributeDetail,
        productSize,
        productMainAttributeAndTerm
      } = response.data
      const productData = {
        'PRODUCT_BASE': productBase, // 基础属性
        'PRODUCT_CUSTOM_ATTRIBUTES': productCustomAttributes, // 商品属性
        'PRODUCT_IMAGES': productImages, // 图片属性
        'PRODUCT_SALES_ATTRIBUTE_DETAIL': productSalesAttributeDetail, // 销售属性
        'PRODUCT_SIZE': productSize, // 尺码表
        'PRODUCT_MAIN_ATTRIBUTE_AND_TERM': productMainAttributeAndTerm
      }
      this.setSkuType(productMainAttributeAndTerm)
      for (let product in productData) {
        this.$store.commit(`product/${product}`, productData[product] || [])
      }
      const { auditRejectReason, status } = productBase
      this.productStatus = status
      this.auditRejectReason = auditRejectReason
      const { productCategorySalesAttributeSelectedList = [] } = deepClone(productSalesAttributeDetail)
      this.comparisonCateInfo(productCategorySalesAttributeSelectedList)
    },
    setSkuType (productMainAttributeAndTerm) {
      const mainAttributeType = isEmpty(productMainAttributeAndTerm.productMainAttributeTermRelationList)
        ? 'color'
        : 'specification'

      this.$store.commit(
        'product/SET_MAIN_ATTRIBUTE_TYPE',
        mainAttributeType
      )
    },
    categoryAttrs (response) {
      return new Promise(resolve => {
        const categoryData = response.data.map(categoryItem => {
          categoryItem.terms.forEach(term => {
            term.extendCode = categoryItem.extendCode
            term.attributeId = categoryItem.id
          })
          return categoryItem
        })
        resolve(categoryData)
      })
    },
    getCategoryAttr () {
      RecommondApi.plmCategoryAttrs(this.categoryId, { system: 2 })
        .then(response => {
          if (response.success) {
            this.categoryAttrs(response)
              .then(cate => {
                if (this.mode === 'create') {
                  const specificationRelatedSizes = cate
                    .find(attr =>
                      attr.saleAttributeType && attr.saleAttributeType.value === 3
                    ) || {}
                  // 规格为是否为主属性
                  const {
                    mainAttribute
                  } = specificationRelatedSizes
                  const mainAttributeType = mainAttribute ? 'specification' : 'color'
                  this.$store.commit('product/SET_MAIN_ATTRIBUTE_TYPE', mainAttributeType)
                  // 创建过滤已经禁用的属性和属性值
                  const filterCategory = this.filterUableSaleAttrs(cate)
                  this.$store.commit(`product/CATEGORY_DATA`, filterCategory || [])
                } else {
                  this.$store.commit(`product/CATEGORY_DATA`, cate || [])
                }
                const disabledCategory = this.disabledCategory(cate)
                this.$store.commit(`product/DISABLED_CATEGORY`, disabledCategory || [])
              })
          }
        })
    },
    create () {
      // 保存数据
      this.getResult()
        .then(res => {
          RecommondApi.productSave(res)
            .then((res) => {
              if (res.success) {
                this.cancel()
              }
            })
        })
    },
    saveSubmit () {
      // 保存提交数据
      this.getResult()
        .then(res => {
          RecommondApi.productSaveSubmit(res)
            .then((res) => {
              if (res.success) {
                this.cancel()
              }
            })
        })
    },
    replenish () {
      // 修改补充信息
      this.getResult()
        .then(res => {
          RecommondApi.replenish(res)
            .then((res) => {
              if (res.success) {
                this.cancel()
              }
            })
        })
    },
    cancel () {
      this.$router.push({ path: '/home/recommend-products/list' })
    },
    /**
     * 创建时过滤禁用的属性和属性值
     */
    filterUableSaleAttrs (categoryData) {
      return categoryData
        .filter(categoryItem => categoryItem.usable)
        .reduce((init, categoryItem) => {
          categoryItem.terms = categoryItem.terms
            .filter(term => term.usable)
          init.push(categoryItem)
          return init
        }, []) || []
    },
    disabledCategory (categoryData) {
      return categoryData
        .filter(cate => !cate.usable && cate.saleAttributeType && [1, 2, 3].includes(cate.saleAttributeType.value))
    },
    /**
   * 回显对比分类判断保存属性是否存在
   */
    comparisonCateInfo (productCategorySalesAttributeSelectedList) {
      if (isEmpty(productCategorySalesAttributeSelectedList)) return
      const newCategoryData = []
      productCategorySalesAttributeSelectedList.forEach(sale => {
        const cateSaleAttr = !isEmpty(this.saleAttrs) && this.saleAttrs.find(attr => attr.id === sale.attributeId)
        if (cateSaleAttr) {
          // 判断销售属性分类上存在
          const { attributeTerms, attributeId } = sale
          const cateTermIds = cateSaleAttr.terms.reduce((init, a) => init.concat(a.id), [])
          const { usable, terms, saleAttributeType } = cateSaleAttr
          if (!usable) cateSaleAttr.name = `${cateSaleAttr.name}(已禁用)`
          // 判断属性值是否禁用
          terms.forEach(sale => {
            if (!sale.usable) {
              sale.name = `${sale.name}(已禁用)`
            }
          })
          if (saleAttributeType.value === 3) {
            // 规格需要处理关联关系
            cateSaleAttr.categoryAttributeRelatedSizes = [...this.categoryAttributeRelatedSizesInfo, ...this.categorySalesAttributeSelectedList]
          }
          // 判断回填的销售属性值是否存在
          attributeTerms.forEach(attrTerm => {
            if (!cateTermIds.includes(attrTerm.id)) {
              Object.assign(attrTerm, {
                name: `${attrTerm.name}(已删除)`,
                attributeId,
                extendCode: sale.attribute.extendCode,
                code: `${attrTerm.id}`
              })
              terms.push(attrTerm)
            }
          })
          newCategoryData.push(cateSaleAttr)
        } else {
          const deleteSaleAttr = this.buidDeletedSaleAttrs(sale)
          newCategoryData.push(deleteSaleAttr)
        }
      })
      const relateCategoryDate = this.changeMainAttributeAndTerm()
      const relateColorCategoryDate = this.changeMainColorAttributeAndTerm()
      let relateCategory = this.specificationMain ? [...newCategoryData, ...relateCategoryDate] : [...newCategoryData, ...relateColorCategoryDate]
      this.$store.commit(`product/COMPARISON_SALE_INFO`, relateCategory || [])
    },
    /**
     * 回显处理已经删除的销售属性
     */
    buidDeletedSaleAttrs (sale) {
      const { attribute, attributeTerms, attributeId } = sale
      Object.assign(attribute, {
        name: `${attribute.name}(已删除)`,
        saleAttributeType: { 'value': attribute.saleAttributeType },
        deleteSale: true
      })
      const deleteAttrs = { ...attribute }
      deleteAttrs['terms'] = attributeTerms
        .map(attr => {
          Object.assign(attr, {
            name: `${attr.name}(已删除)`,
            attributeId,
            extendCode: attribute.extendCode,
            code: `${attr.id}`
          })
          return attr
        })
      return deleteAttrs
    },
    /**
    * 回显判断分类上的关联关系是否发生变化
    */
    changeMainAttributeAndTerm () {
      const {
        mainAttributeId
      } = deepClone(this.productMainAttributeAndTerm)
      let relateCategoryData = []
      // 当前分类上所有关联关系
      const { id, mainAttribute } = this.specification
      // 当前关联规格主属性没有变
      if ((id === mainAttributeId && mainAttribute)) {
        const categoryRelatedSizes = this.specification.categoryAttributeRelatedSizes
        const relateCategoryDataIds = categoryRelatedSizes
          .filter(cate => !this.relationIds.includes(cate.relatedSizeId))
          .reduce((init, cate) => init.concat(cate.relatedSizeId), [])
        relateCategoryData = this.categoryData
          .filter(cate => relateCategoryDataIds.includes(cate.id))
      }
      return relateCategoryData
    },
    /**
     * 颜色为主属性
     */
    changeMainColorAttributeAndTerm () {
      const { productCategorySalesAttributeSelectedList,
        productMainAttributeAndTerm: { mainAttributeId }
      } = this.productSalesAttributeDetail
      const { id, mainAttribute } = this.specification
      if (mainAttribute && (id !== mainAttributeId)) {
        // 变更了主属性
        return []
      } else {
        const productAttrIds = productCategorySalesAttributeSelectedList
          .reduce((init, attr) => init.concat(attr.attributeId), [])
        return this.saleAttrs.filter(sale => !productAttrIds.includes(sale.id))
      }
    },
    getResult () {
      // 获取需要保存/提交的数据
      const result = []
      const refs = this.productComponents
      refs.forEach(res => {
        const resultPromises = this.$refs[res][0].result()
        result.push(resultPromises)
      })
      return Promise.all(result)
        .then((res) => {
          const [
            { productBase },
            { productImages },
            { productSalesAttributes } = {},
            { productSize } = {},
            { productCustomAttributes } = {}
          ] = res
          Object.assign(productBase, {
            'id': this.id,
            'categoryId': this.categoryId,
            'categoryPath': this.categoryPath
          })
          return {
            productBase,
            productImages,
            productSize,
            productCustomAttributes,
            ...productSalesAttributes
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.product {
  width: 95%;
  margin: 0 auto;
  &-btn {
    display: flex-start;
  }
  /deep/.title {
    font-size: 1.6rem;
    font-weight: bold;
    margin-left: 2rem;
    color: #909399;
  }
  /deep/.form {
    width: 90%;
    margin: 0 auto;
  }
  /deep/.no-data {
    height: 10rem;
    color: #909399;
    line-height: 10rem;
  }
  /deep/.el-form-item {
    .el-form-item__label {
      position: relative;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 25px;
      height: 45px;
      &::after {
        position: absolute;
        right: 10px;
        top: 0;
      }

      .form-label--tag {
        position: absolute;
        right: 25px;
        bottom: 0;
        color: #909399;
        line-height: 20px;
      }
    }
  }
  &-btn {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
