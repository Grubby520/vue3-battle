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
import axios from 'axios'
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
      // RecommondApi.recommendDetail(this.id)
      axios.get('http://10.250.0.66:7300/mock/600fb0aafdd97627d2722680/erp-plm2/product/detail')
        .then(res => {
          const { productCustomAttributes, productImages, productSalesAttributeDetailVO, productSize, status, ...rest } = res.data.data
          // 基础属性
          this.$store.commit('product/PRODUCTBASIC', rest || [])
          // 商品属性
          this.$store.commit('product/PRODUCTCUSTOMATTRIBUTES', productCustomAttributes || [])
          // 销售属性
          this.$store.commit('product/PRODUCTSALESATTRIBUTEDETAILVO', productSalesAttributeDetailVO || [])
          // 图片属性
          this.$store.commit('product/PRODUCTIMAGES', productImages || [])
          // 尺码表
          this.$store.commit('product/PRODUCTSIZE', productSize || [])
          this.productStatus = status
        })
    },
    create () {
      // 保存数据
      this.getResult()
        .then(res => {
          // console.log('222222222222222', res)
          switch (this.$refs.control.someBtnParams) {
            // 确定
            case 0:
              RecommondApi.productSave(res)
                .then(res => {
                  console.log('res', '创建成功')
                })
              break
            // 提交(确定补充信息)
            case 1:
              break
          }
        })
    },
    modify () {
      // 编辑数据
      this.getResult()
        .then(res => {
          // console.log('res1111111111111', res)
          switch (this.$refs.control.someBtnParams) {
            // 确定
            case 0:
              break
            // 提交(确定补充信息)
            case 1:
              break
          }
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
          const [{ productbasic }, { productImages }, { productSalesAttributes }, { productSize }, { productCustomAttributes }] = res
          return {
            ...productbasic,
            categoryId: this.categoryId,
            categoryPath: this.categoryPath,
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
