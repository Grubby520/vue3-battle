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
      <el-button type="primary" @click="save(0)">保存</el-button>
      <el-button type="primary" v-if="productStatus !== 3" @click="save(1)">提交</el-button>
      <el-button type="primary" v-if="productStatus === 3">确定补充信息</el-button>
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
import { mapGetters } from 'vuex'
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
    }
  },
  computed: {
    ...mapGetters('product', ['sizeStandard']),
    isStatus () {
      return this.mode === 'view'
    },
    saveText () {
      return this.isStatus ? [] : this.productStatus !== 3 ? [{ 0: '保存' }, { 1: '提交' }] : [{ 0: '保存' }, { 1: '确定补充信息' }]
    },
    productComponents () {
      let currentComponents = []
      // 规格为是否为主属性
      const mainAttr = this.specificationRelatedSizes.categoryAttributeRelatedSizes
      if (this.productStatus >= 3) {
        // 通过侵权审核
        if (mainAttr) {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductSpecificationMain', 'ProductSize', 'ProductAttr']
        } else {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductColorMain', 'ProductSize', 'ProductAttr']
        }
      } else {
        if (mainAttr) {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductSpecificationMain']
        } else {
          currentComponents = ['ProductBase', 'ProductImages', 'ProductColorMain']
        }
      }
      return currentComponents
    },
    specificationRelatedSizes () {
      return this.categoryData
        .find(attr =>
          attr.saleAttributeType && attr.saleAttributeType.value === 3
        ) || {}
    }
  },
  mounted () {
    if (this.mode === 'create') {
      this.getCategoryAttr()
    }
  },
  methods: {
    load () {
      if (this.mode === 'view') {
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
      }
    },
    productAttrsInfo (response) {
      const {
        productBase,
        productCustomAttributes,
        productImages,
        productSalesAttributeDetail,
        productSize
      } = response.data
      const productData = {
        'PRODUCT_BASE': productBase, // 基础属性
        'PRODUCT_CUSTOM_ATTRIBUTES': productCustomAttributes, // 商品属性
        'PRODUCT_IMAGES': productImages, // 图片属性
        'PRODUCT_SALES_ATTRIBUTE_DETAIL': productSalesAttributeDetail, // 销售属性
        'PRODUCT_SIZE': productSize // 尺码表
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
    save (status) {
      if (this.mode === 'create') {
        this.create(status)
      }
      if (this.mode === 'modify') {
        this.modify()
      }
    },
    create (status) {
      // 保存数据
      this.getResult()
        .then(res => {
          // 0：productSave 确定 1：productSaveSubmit 提交
          const interfaces = status === 0 ? 'productSave' : 'productSaveSubmit'
          RecommondApi[interfaces](res)
            .then((res) => {
              if (res.success) {
                this.cancel()
              }
            })
        })
    },
    modify () {
      // 编辑数据
      this.getResult()
        .then(res => {
          let interfacesStatus = {
            0: 'productSave'
          }
          // productStatus 3:保存 非3：修改补充信息
          interfacesStatus[1] = this.productStatus !== 3 ? 'productSaveSubmit' : 'replenish'
          const interfaces = interfacesStatus[status]
          RecommondApi[interfaces](res)
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
