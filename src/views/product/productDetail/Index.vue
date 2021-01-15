<template>
  <div class="product">
    <ProductBase ref="ProductBase"></ProductBase>
    <ProductImages ref="ProductBase"></ProductImages>
    <ProductSale ref="ProductSale"></ProductSale>
    <ProductSize ref="ProductSize"></ProductSize>
    <ProductAttr ref="ProductAttr"></ProductAttr>
  </div>
</template>

<script>
import ProductBase from './ProductBase'
import ProductAttr from './ProductAttr'
import ProductSale from './ProductSale'
import ProductSize from './ProductSize'
import ProductImages from './ProductImages'

export default {
  components: { ProductSize, ProductSale, ProductAttr, ProductBase, ProductImages },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

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
