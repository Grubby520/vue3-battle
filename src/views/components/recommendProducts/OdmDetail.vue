<template>
  <div class="odmDetail">
    <div :class="{'view-container': isStatus}">
      <OdmDetailBase
        :categoryId="categoryId"
        :cateLabels="cateLabels"
        :productBasicInfo="productBasicInfo"
        ref="OdmDetailBase"
      />
      <!-- <OdmDetailAttr ref="OdmDetailAttr" />
      <OdmDetailProductAttr ref="OdmDetailProductAttr" />-->
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
// import OdmDetailAttr from './OdmDetailAttr'
// import OdmDetailProductAttr from './OdmDetailProductAttr'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import SalesAttributes from '@/views/createProduct/SalesAttributes'
import ProductAttributes from '@/views/createProduct/ProductAttributes'

export default {
  components: {
    OdmDetailBase,
    // OdmDetailAttr,
    // OdmDetailProductAttr,
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
      initSaleAttr: [],
      productBasicInfo: [],
      productCustomizeAttributeList: [],
      productSalesAttributeList: []
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
      const OdmDetailBase = new Promise((resolve, reject) => {
        this.$refs['OdmDetailBase'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      const OdmDetailAttr = new Promise((resolve, reject) => {
        this.$refs['saleAttributesInfo'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      const OdmDetailProductAttr = new Promise((resolve, reject) => {
        this.$refs['customAttributesInfo'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      Promise.all([OdmDetailBase, OdmDetailAttr, OdmDetailProductAttr])
        .then(() => {
          const params = {}
          if (status === 'create') {
            // 保存
            const productBasicInfo = this.$refs.OdmDetailBase.commmitInfo()
            let data = {} // @todo:warning 详情数据，到时候替换
            const dataBasicInfo = data.productBasicInfo
            productBasicInfo.colorImageList = dataBasicInfo.colorImageList
            productBasicInfo.productImageList = dataBasicInfo.productImageList
            data.productBasicInfo = productBasicInfo
            this.create(data)
          } else {
            // 保存提交
            this.modify(params)
          }
        })
        .catch(err => {
          console.log('验证失败', err)
        })
    },
    load () {
      RecommondApi.recommendDetail(this.id)
        .then(res => {
          const { productBasicInfo, productCustomizeAttributeList, productSalesAttributeList } = res.data
          this.productBasicInfo = productBasicInfo
          // this.productCustomizeAttributeList = productCustomizeAttributeList
          this.initSaleAttr = productCustomizeAttributeList
          this.productSalesAttributeList = productSalesAttributeList
        })
    },
    create (params) {
      RecommondApi.save(params)
        .then(res => {
          this.$router.back()
        })
    },

    modify (params) {
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
