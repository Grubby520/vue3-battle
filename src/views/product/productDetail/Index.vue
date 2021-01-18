<template>
  <div class="product">
    <div :class="{'view-container': isStatus}">
      <ProductBase ref="productBase"></ProductBase>
      <ProductImages ref="productImages"></ProductImages>
      <ProductSale ref="productSale"></ProductSale>
      <ProductSize ref="productSize"></ProductSize>
      <ProductAttr ref="productAttr"></ProductAttr>
    </div>
    <SlDetails
      :references="$refs"
      form="form"
      :mode="mode"
      :create="create"
      :load="load"
      :modify="modify"
      :cancel="cancel "
      saveText="确定"
      cancelText="取消"
    />
  </div>
</template>

<script>
import ProductBase from './ProductBase'
import ProductAttr from './ProductAttr'
import ProductSale from './ProductSale'
import ProductSize from './ProductSize'
import ProductImages from './ProductImages'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'

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

    }
  },
  created () {

  },
  mounted () {

  },
  watch: {
    '$props': {
      handler (newValue) {
        this.$store.commit('product/PRODUCT_PARAMS', this.$props)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    isStatus () {
      if (this.mode !== 'view') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    load () {
      RecommondApi.recommendDetail(this.id)
        .then(res => {
          const { productBasicInfo, productCustomizeAttributeList, productSalesAttributeList } = res.data
          // 基础属性
          this.$store.commit('product/PRODUCTBASICINFO', productBasicInfo || [])
          // 商品属性
          this.$store.commit('product/PRODUCTCUSTOMIZEATTRIBUTELIST', productCustomizeAttributeList || [])
          // 销售属性
          this.$store.commit('product/PRODUCTSALESATTRIBUTELIST', productSalesAttributeList || [])
        })
    },
    create () {
      // console.log('11111111111111111111111111111')
      const result = this.getResult()
      Promise.all(result)
        .then((res) => {
          // const { productBasicInfo, productImageList, productSale, productSizes, productAttr } = res.data
          // console.log('res', res)
        })
    },
    modify () { },
    cancel () { },
    getResult () {
      const result = []
      for (const ref in this.$refs) {
        result.push(this.$refs[ref].result())
      }
      // console.log('result', result)
      return result
    }
  }
}
</script>

<style scoped lang="scss">
.product {
  width: 95%;
  margin: 0 auto;
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
}
</style>
