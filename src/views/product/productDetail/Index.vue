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
      <el-button @click="cancel">返回列表</el-button>
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
  components: { ProductSize, ProductColorMain, ProductAttr, ProductBase, ProductImages, ProductSpecificationMain },
  data () {
    return {
      productStatus: undefined,
      loading: false,
      categoryData: []
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
    isStatus () {
      return this.mode === 'view'
    },
    specificationRelatedSizes () {
      return this.categoryData
        .find(attr =>
          attr.saleAttributeType && attr.saleAttributeType.value === 3
        ) || {}
    },
    specificationMain () {
      // 规格为是否为主属性
      const {
        categoryAttributeRelatedSizes,
        mainAttribute
      } = this.specificationRelatedSizes || {}
      return categoryAttributeRelatedSizes && mainAttribute
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
      for (let product in productData) {
        this.$store.commit(`product/${product}`, productData[product] || [])
      }
      this.productStatus = productBase.status
    },
    categoryAttrs (response) {
      const categoryData = response.data.map(categoryItem => {
        categoryItem.terms.forEach(term => {
          term.extendCode = categoryItem.extendCode
          term.attributeId = categoryItem.id
        })
        return categoryItem
      })
      this.categoryData = categoryData
      this.$store.commit(`product/CATEGORY_DATA`, categoryData || [])
    },
    getCategoryAttr () {
      RecommondApi.plmCategoryAttrs(this.categoryId, { system: 2 })
        .then(response => {
          this.categoryAttrs(response)
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
            { productSalesAttributes },
            { productSize } = {},
            { productCustomAttributes } = {}
          ] = res
          Object.assign(productBase, {
            'id': this.id,
            'categoryId': this.categoryId,
            'categoryPath': this.categoryPath
          })
          let sale = {}
          const mainAttr = this.specificationRelatedSizes.categoryAttributeRelatedSizes
          if (mainAttr) {
            sale = { ...productSalesAttributes }
          } else {
            sale = { productSalesAttributes }
          }
          return {
            productBase,
            productImages,
            productSize,
            productCustomAttributes,
            ...sale
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
