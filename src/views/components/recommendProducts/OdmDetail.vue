<template>
  <div class="odmDetail">
    <div :class="{'view-container': isStatus}">
      <OdmDetailBase
        :categoryId="categoryId"
        :cateLabels="cateLabels"
        :productBasicInfo="productBasicInfo"
        ref="OdmDetailBase"
      />
      <SalesAttributes
        ref="saleAttributesInfo"
        :mode="mode"
        :categoryId="categoryId"
        :productId="id"
        :initialValue="initSaleAttr"
      ></SalesAttributes>
      <ProductAttributes
        ref="customAttributesInfo"
        :canUpdate="true"
        :canView="false"
        :categoryId="categoryId"
        :productId="id"
        :initialValue="productCustomizeAttributeList"
      ></ProductAttributes>
    </div>
    <div class="odmDetail-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submitForm('create')" type="primary">保存</el-button>
      <el-button @click="submitForm('submit')" type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
import OdmDetailBase from './OdmDetailBase'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import SalesAttributes from '@/views/createProduct/SalesAttributes'
import ProductAttributes from '@/views/createProduct/ProductAttributes'

export default {
  components: {
    OdmDetailBase,
    SalesAttributes,
    ProductAttributes
  },
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: String, required: false, default: '' },
    // 分类Id
    categoryId: {
      type: [String, Number],
      default: ''
    },
    cateLabels: { type: String, required: false, default: '' }
  },
  data () {
    return {
      ref: [],
      initSaleAttr: {},
      productBasicInfo: {},
      productCustomizeAttributeList: {},
      productSalesAttributeList: {}
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
  mounted () {
    this.load()
  },
  methods: {
    submitForm (status) {
      const OdmDetailBase = this.$refs.OdmDetailBase.commmitInfo()
      const initSaleAttr = this.$refs.saleAttributesInfo.validateAndGet()
      const productCustomizeAttributeList = this.$refs.saleAttributesInfo.getSubmitData()
      Promise.all([OdmDetailBase, initSaleAttr, productCustomizeAttributeList])
        .then((res) => {
          const [{ productBasicInfo }, { productImageList }, { productSalesAttributeList }] = res
          let data = {} // @todo:warning 详情数据，到时候替换
          data.productBasicInfo = productBasicInfo
          data.productBasicInfo.productImageList = productImageList
          data.productSalesAttributeList = productSalesAttributeList
          if (status === 'create') {
            // 保存
            this.create(data)
          } else {
            // 保存提交
            this.submit(data)
          }
        })
        .catch(() => {
        })
    },
    load () {
      RecommondApi.recommendDetail(this.id)
        .then(res => {
          const { productBasicInfo, productCustomizeAttributeList, productSalesAttributeList } = res.data
          if (this.productBasicInfo && this.productBasicInfo.length > 0) this.productBasicInfo = productBasicInfo
          // this.productCustomizeAttributeList = productCustomizeAttributeList
          if (this.productCustomizeAttributeList && this.productCustomizeAttributeList.length > 0) this.initSaleAttr = productCustomizeAttributeList
          if (this.productSalesAttributeList && this.productSalesAttributeList.length > 0) this.productSalesAttributeList = productSalesAttributeList
        })
    },
    create (params) {
      debugger
      RecommondApi.save(params)
        .then(res => {
          this.$router.back()
        })
    },

    submit (params) {
      RecommondApi.saveSubmit(params)
        .then(res => {
          this.$router.back()
        })
    },
    cancel () {
      this.$router.push({ path: '/home/recommend-products/list', query: {} })
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetail {
  border: 1px solid #dcdfe6;
  &-btn {
    text-align: center;
    margin: 20px;
  }
}

.view-container {
  pointer-events: none;
  cursor: not-allowed;
  /deep/.el-input__inner {
    border: 0;
  }
  /deep/.stl-big-data-select .selected-tags[data-v-05976cfe] {
    border: 0;
  }
  /deep/.el-textarea__inner {
    border: 0 !important;
  }
}
</style>
