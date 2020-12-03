<template>
  <div>
    <SalesAttributes></SalesAttributes>
    <ProductAttributes ref="customAttributesInfo" :canUpdate="true" :canView="false"></ProductAttributes>
  </div>
</template>

<script>
import SalesAttributes from '@/views/createProduct/SalesAttributes'
import ProductAttributes from '@/views/createProduct/ProductAttributes'

export default {
  name: 'Index',
  components: {
    SalesAttributes,
    ProductAttributes
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
</style>
