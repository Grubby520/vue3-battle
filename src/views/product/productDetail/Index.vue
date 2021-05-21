<template>
  <div class="product">
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
import ProductColorMain from './ProductColorMain'
import ProductSpecificationMain from './ProductSale/SpecificationMain/SkuInfo'
import ProductSize from './ProductSize'
import ProductImages from './ProductImages'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import { mapGetters } from 'vuex'
import { isEmpty, deepClone } from '@shared/util'
// import { deepClone } from '@shared/util'
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
    ...mapGetters('product', ['specificationMain', 'saleAttrs', 'categoryData', 'productSalesAttributeDetail']),
    isStatus () {
      return this.mode === 'view'
    },
    productComponents () {
      let currentComponents = []
      if (this.productStatus >= 3) {
        // 通过侵权审核
        if (this.specificationMain) {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductSpecificationMain', 'ProductSize', 'ProductAttr']
        } else {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductColorMain', 'ProductSize', 'ProductAttr']
        }
      } else {
        if (this.specificationMain) {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductSpecificationMain']
        } else {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductColorMain']
        }
      }
      return currentComponents
    },
    specification () {
      // 分类上的规格
      return this.categoryData.find(attr => attr.saleAttributeType && attr.saleAttributeType.value === 3) || {}
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
      this.productStatus = productBase.status
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
        this.$store.commit(`product/CATEGORY_DATA`, categoryData || [])
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
                }
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
      // 取消
      this.$router.push({ path: '/home/recommend-products/list' })
    },
    /**
   * 对比分类判断销售属性和和属性值是否在分类上
   */
    comparisonCateInfo (productCategorySalesAttributeSelectedList) {
      const deletedRelatedermIds = this.changeMainAttributeAndTerm()
      const newCategoryData = []
      productCategorySalesAttributeSelectedList.forEach(sale => {
        if (!deletedRelatedermIds.includes(sale.attributeId)) {
          const cateSaleAttr = this.saleAttrs.find(attr => attr.id === sale.attributeId)
          // 判断销售属性分类上存在
          const { attributeTerms, attributeId } = sale
          const cateTermIds = cateSaleAttr.terms.reduce((init, a) => init.concat(a.id), [])
          if (!cateSaleAttr.usable) cateSaleAttr.name = `${cateSaleAttr.name}(已禁用)`
          // 判断属性值是否禁用
          cateSaleAttr.terms.forEach(sale => {
            if (!sale.usable) {
              sale.name = `${sale.name}(已禁用)`
            }
          })
          // 判断回填的销售属性值是否存在
          attributeTerms.forEach(attrTerm => {
            if (!cateTermIds.includes(attrTerm.id)) {
              attrTerm.name = `${attrTerm.name}(已删除)`
              attrTerm['attributeId'] = attributeId
              cateSaleAttr.terms.push(attrTerm)
            }
          })
          newCategoryData.push(cateSaleAttr)
        } else {
          // 构建删除的销售属性补充分类上的的数据
          const deleteSaleAttr = this.buidDeletedSaleAttrs(sale)
          newCategoryData.push(deleteSaleAttr)
        }
      })
      this.productSizeData(productCategorySalesAttributeSelectedList)
      this.$store.commit(`product/COMPARISON_SALE_INFO`, [...newCategoryData] || [])
    },
    /**
     * 回显判断分类上的关联关系是否发生变化
     */
    changeMainAttributeAndTerm () {
      const deletedRelatedSizeTerm = []
      const {
        productMainAttributeAndTerm: { productMainAttributeTermRelationList = [] } = {},
        productCategorySalesAttributeSelectedList = []
      } = deepClone(this.productSalesAttributeDetail)
      const categoryAttributeRelatedSizes = this.specification.categoryAttributeRelatedSizes
      // 当前绑定关联关系的所有尺码ids
      const saleSizeIds = productCategorySalesAttributeSelectedList
        .filter(sale => sale.attribute.saleAttributeType === 2)
        .reduce((init, size) => {
          init.push(size.attribute.id)
          return init
        }, [])
      // 分类上是否删除了销售属性-color
      const deleteColorId = productCategorySalesAttributeSelectedList
        .filter(color => color.attribute.saleAttributeType === 1)
        .reduce((init, color) => {
          const saleColor = this.categoryData.find(cate => cate.id === color.attributeId)
          if (!saleColor) {
            init.push(color.attributeId)
          }
          return init
        }, [])
      deletedRelatedSizeTerm.push(...deleteColorId)
      // 查找删除的关联关系
      productMainAttributeTermRelationList.forEach(term => {
        const deletedrelateTerms = []
        const { mainAttributeTermId, relatedAttributeAndTermList } = term
        const currentRelatedSizes = categoryAttributeRelatedSizes.find(size => size.termId === mainAttributeTermId)
        const relatedSizeTerm = relatedAttributeAndTermList.find(term => saleSizeIds.includes(term.attributeId))
        deletedrelateTerms.push(relatedSizeTerm.attributeId)
        if (currentRelatedSizes.relatedSizeId !== relatedSizeTerm.attributeId) {
          // 当前的关联关系删除
          deletedRelatedSizeTerm.push(relatedSizeTerm.attributeId)
        }
      })
      return deletedRelatedSizeTerm
    },
    /**
     * 回显尺码表需要数据
     */
    buidDeletedSaleAttrs (sale) {
      const { attribute, attributeTerms, attributeId } = sale
      attribute['name'] = `${attribute.name}(已删除)`
      attribute['saleAttributeType'] = { 'value': attribute.saleAttributeType }
      const deleteAttrs = { ...attribute }
      deleteAttrs['terms'] = attributeTerms.map(attr => {
        attr['name'] = `${attr.name}(已删除)`
        attr['attributeId'] = attributeId
        return attr
      })
      if (attribute.saleAttributeType.value === 3) {
        // 删除的属性是规格属性需要处理关联关系
        deleteAttrs['categoryAttributeRelatedSizes'] = this.categoryAttributeRelatedSizes(sale)
      }
      return deleteAttrs
    },
    /**
    * 回显删除规格的关联关系
    */
    categoryAttributeRelatedSizes () {
      const {
        productMainAttributeAndTerm: { productMainAttributeTermRelationList = [] } = {},
        productCategorySalesAttributeSelectedList = []
      } = deepClone(this.productSalesAttributeDetail)
      const saleSizeIds = productCategorySalesAttributeSelectedList
        .filter(sale => sale.attribute.saleAttributeType === 2)
        .reduce((init, size) => {
          init.push(size.attribute.id)
          return init
        }, [])
      const categoryAttributeRelatedSizes = productMainAttributeTermRelationList
        .map(relation => {
          const { relatedAttributeAndTermList, mainAttributeTermId } = relation
          const relatedSizeId = relatedAttributeAndTermList
            .find(term => saleSizeIds.includes(term.attributeId)).attributeId
          const saleAttrRelation = {}
          saleAttrRelation['termId'] = mainAttributeTermId
          saleAttrRelation['relatedSizeId'] = relatedSizeId
          return saleAttrRelation
        })
      return categoryAttributeRelatedSizes
    },
    /**
     * 回显尺码需要的数据
     */
    productSizeData (productCategorySalesAttributeSelectedList) {
      // 尺码表需要数据
      const attributeTerms = productCategorySalesAttributeSelectedList
        .filter(term => term.attribute.saleAttributeType === 2)
        .reduce((init, term) => {
          init.push(...term.attributeTerms)
          return init
        }, [])
      this.$store.commit(`product/SET_CHECKED_ATTRS`, attributeTerms || [])
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
