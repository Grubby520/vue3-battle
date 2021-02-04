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
      productStatus: undefined
    }
  },
  watch: {
    '$props': {
      handler () {
        this.$store.commit('product/PRODUCT_PARAMS', this.$props)
        // 清除编辑状态的数据
        this.mode === 'create' && this.$store.commit('product/REMOVESTASHATTRS', [])
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
      switch (this.isStatus) {
        case true:
          return []
        default:
          return this.productStatus !== 2 ? [{ 0: '保存' }, { 1: '提交' }] : [{ 0: '保存' }, { 1: '确定补充信息' }]
      }
    }
  },
  methods: {
    load () {
      RecommondApi.product(this.id)
        .then(res => {
          const { productBase, productCustomAttributes, productImages, productSalesAttributeDetailVO, productSize } = res.data
          // 基础属性
          this.$store.commit('product/PRODUCTBASE', productBase || [])
          // 商品属性
          this.$store.commit('product/PRODUCTCUSTOMATTRIBUTES', productCustomAttributes || [])
          // 销售属性
          this.$store.commit('product/PRODUCTSALESATTRIBUTEDETAILVO', productSalesAttributeDetailVO || [])
          // 图片属性
          this.$store.commit('product/PRODUCTIMAGES', productImages || [])
          // 尺码表
          this.$store.commit('product/PRODUCTSIZE', productSize || {})
          this.productStatus = productBase.status
        })
    },
    create () {
      // 保存数据
      this.getResult()
        .then(res => {
          const interfacesStatus = {
            0: 'productSave', // 确定
            1: 'productSaveSubmit' // 提交
          }
          const interfaces = interfacesStatus[this.$refs.control.someBtnParams]
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
        const condition = Object.keys(this.$refs[ref].$refs).length > 0
        condition && result.push(this.$refs[ref].result())
      }
      return Promise.all(result)
        .then((res) => {
          const [{ productBase }, { productImages }, { productSalesAttributes }, { productSize }, { productCustomAttributes }] = res
          productSize.id = this.id
          productBase.id = this.id
          productBase.categoryId = this.categoryId
          productBase.categoryPath = this.categoryPath
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
