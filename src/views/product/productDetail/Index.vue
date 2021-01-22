<template>
  <div class="product">
    <el-alert
      v-if="saleAttrNone"
      :title="`${cateLabels}品类未配置销售属性，无法创建产品`"
      type="error"
      effect="dark"
      style="margin-bottom: 1rem;"
    />
    <div :class="{'view-container': isStatus}">
      <ProductBase ref="productBase" />
      <ProductImages ref="productImages" />
      <ProductSale ref="productSale" />
      <ProductSize ref="productSize" />
      <ProductAttr ref="productAttr" />
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
        :cancel="cancel "
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
      productStatus: undefined
    }
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
    ...mapGetters('product', ['saleAttrNone']),
    isStatus () {
      return this.mode === 'view'
    },
    saveText () {
      return this.productStatus !== 2 ? [{ 0: '保存' }, { 1: '提交' }] : [{ 0: '保存' }, { 1: '确定补充信息' }]
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
          // this.isStatus = res.status
          this.productStatus = 2
        })
    },
    create () {
      // 保存数据
      this.getResult()
        .then(res => {
          // console.log('res', res)
          switch (this.$refs.control.someBtnParams) {
            // 确定
            case 0:
              break
            // 提交
            case 1:
              break
          }
        })
    },
    modify () {
      // 编辑数据
    },
    cancel () {
      // 取消
      this.$router.push({ path: '/home/recommend-products/list' })
    },
    getResult () {
      // 获取需要保存/提交的数据
      const result = []
      for (const ref in this.$refs) {
        const condition = Object.keys(this.$refs[ref].$refs).length > 0
        condition && result.push(this.$refs[ref].result())
      }
      return Promise.all(result)
        .then((res) => {
          const [{ productBasicInfo }, { productImages }, { productCategorySalesAttributes }, { productSize }, { productCustomAttributes }] = res
          return {
            ...productBasicInfo,
            categoryId: this.categoryId,
            categoryPath: this.categoryPath,
            productImages,
            productCategorySalesAttributes,
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
    .addbtn {
      margin-right: 1rem;
    }
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
}
</style>
