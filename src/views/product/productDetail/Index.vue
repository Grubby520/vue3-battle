<template>
  <div class="product">
    <div
      v-for="component in productComponents"
      :key="component"
      :class="{'view-container': isStatus}"
    >
      <component :is="component" :ref="component" />
    </div>
    <div class="product-btn">
      <SlDetails
        ref="control"
        :references="$refs"
        form="form"
        :mode="mode"
        :create="create"
        :load="load"
        :modify="modify"
        :cancel="cancel"
        :saveText="saveText"
        cancelText="取消"
      />
    </div>
  </div>
</template>

<script>
import ProductBase from './ProductBase'
import ProductAttr from './ProductAttr'
import ProductSale from './ProductSale'
import ProductSize from './ProductSize'
import ProductImages from './ProductImages'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import { mapGetters } from 'vuex'
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
  components: { ProductSize, ProductSale, ProductAttr, ProductBase, ProductImages },
  data () {
    return {
      productStatus: undefined,
      productComponents: ['ProductBase', 'ProductImages', 'ProductSale', 'ProductSize', 'ProductAttr']
    }
  },
  watch: {
    '$props': {
      handler () {
        this.$store.commit('product/PRODUCT_PARAMS', this.$props)
        // 清除编辑状态的数据
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
      return this.isStatus ? [] : this.productStatus !== 2 ? [{ 0: '保存' }, { 1: '提交' }] : [{ 0: '保存' }, { 1: '确定补充信息' }]
    }
  },
  methods: {
    load () {
      RecommondApi.product(this.id)
        .then(res => {
          const { productBase, productCustomAttributes, productImages, productSalesAttributeDetail, productSize } = res.data
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
        })
    },
    create () {
      // 保存数据
      this.getResult()
        .then(res => {
          // 0：productSave 确定 1：productSaveSubmit 提交
          const interfaces = this.$refs.control.someBtnParams === 0 ? 'productSave' : 'productSaveSubmit'
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
          // productStatus 2:保存 非2：修改补充信息
          this.productStatus !== 2 ? interfacesStatus[1] = 'productSaveSubmit' : interfacesStatus[1] = 'replenish'
          const interfaces = interfacesStatus[this.$refs.control.someBtnParams]
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
      for (const ref in this.$refs) {
        const currentRef = this.$refs[ref][0]
        currentRef && result.push(currentRef.result())
      }
      return Promise.all(result)
        .then((res) => {
          const [{ productBase }, { productImages }, { productSalesAttributes }, { productSize }, { productCustomAttributes }] = res
          Object.assign(productBase, {
            'id': this.id, 'categoryId': this.categoryId, 'categoryPath': this.categoryPath
          })
          return {
            productBase,
            productImages,
            productSalesAttributes,
            productSize,
            productCustomAttributes
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
}
</style>
