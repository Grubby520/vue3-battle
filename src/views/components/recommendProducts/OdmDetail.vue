<template>
  <div class="odmDetail">
    <div :class="{'view-container': isStatus}">
      <OdmDetailBase
        :categoryId="categoryId"
        :cateLabels="cateLabels"
        :isStatus="isStatus"
        :productBasicInfo="productBasicInfo"
        :supplierItemNo="supplierItemNo"
        ref="OdmDetailBase"
      />
      <SalesAttributes
        v-if="!loading"
        ref="saleAttributesInfo"
        :mode="mode"
        :categoryId="categoryId"
        :productId="id"
        :initialValue="initSaleAttr"
      ></SalesAttributes>
      <ProductAttributes
        v-if="!loading"
        ref="customAttributesInfo"
        :canUpdate="mode !=='view'"
        :canView="mode ==='view'"
        :categoryId="categoryId"
        :productId="id"
        :initialValue="productCustomizeAttributeList"
      ></ProductAttributes>
    </div>
    <div class="odmDetail-btn" v-if="!isStatus">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submitForm('create')" type="primary">保存</el-button>
      <el-button @click="submitForm('submit')" type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
import { errorNotify } from '@shared/util'
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
    id: { type: [String, Number], required: false, default: '' },
    // 分类Id
    categoryId: {
      type: [String, Number],
      default: ''
    },
    categoryLevel: { type: String, required: false, default: '' },
    cateLabels: { type: String, required: false, default: '' },
    supplierItemNo: { type: String, required: false, default: '' }
  },
  data () {
    return {
      ref: [],
      initSaleAttr: {},
      productBasicInfo: {},
      productCustomizeAttributeList: [],
      productSalesAttributeList: {},
      loading: true
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
      const productCustomizeAttributeList = this.$refs.customAttributesInfo.getSubmitData()
      let data = {}
      Promise.all([OdmDetailBase, initSaleAttr, productCustomizeAttributeList])
        .then((res) => {
          const [{ productBasicInfo }, { productImageList, productSalesAttributeList }, productCustomizeAttributeList] = res
          data.productBasicInfo = productBasicInfo
          data.productBasicInfo.categoryLevel = this.categoryLevel
          data.productBasicInfo.productImageList = productImageList
          data.productSalesAttributeList = productSalesAttributeList
          data.productCustomizeAttributeList = productCustomizeAttributeList
          if (status === 'create') {
            this.create(data)
          } else {
            this.submit(data)
          }
        })
        .catch(() => {
        })
    },
    load () {
      if (this.mode === 'create') {
        this.loading = false
        return
      }
      const _this = this
      RecommondApi.recommendDetail(this.id)
        .then(res => {
          const { productBasicInfo = [], productCustomizeAttributeList = [], productSalesAttributeList = [] } = res.data
          const { productImageList } = productBasicInfo
          // 销售属性回显
          if (productSalesAttributeList && productSalesAttributeList.length > 0) {
            _this.initSaleAttr.productSalesAttributeList = productSalesAttributeList
            _this.initSaleAttr.productImageList = productImageList
          }
          // 基本属性回显
          if (productBasicInfo) _this.productBasicInfo = productBasicInfo
          // 商品属性回显
          if (productCustomizeAttributeList && productCustomizeAttributeList.length > 0) _this.productCustomizeAttributeList = productCustomizeAttributeList
        }).finally(() => {
          this.loading = false
        })
    },
    create (params) {
      RecommondApi.save(params)
        .then(res => {
          this.$router.push({ path: '/home/recommend-products/list' })
        })
    },

    submit (params) {
      if (!this.id) {
        // 创建产品调用的保存提交
        RecommondApi.saveSubmit(params)
          .then(res => {
            this.$router.push({ path: '/home/recommend-products/list' })
          })
      } else {
        // 编辑状态调用的列表的提交接口
        RecommondApi.recommend({ productIdList: [this.id] })
          .then(() => {
            this.$router.back()
          })
          .catch((error) => {
            if (error.error === '100002') {
              errorNotify(this, `账号在别处登录`)
            }
          })
      }
    },
    cancel () {
      this.$router.push({ path: '/home/recommend-products/list' })
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetail {
  border: 1px solid #dcdfe6;
  &-btn {
    text-align: center;
    position: sticky;
    bottom: 0;
    z-index: 999;
    padding: 2rem 0;
    background: white;
  }
}

.view-container {
  pointer-events: none;
  cursor: not-allowed;
  /deep/.el-input__inner {
    border: 0;
    &::placeholder {
      color: #fff !important;
    }
  }
  /deep/.stl-big-data-select .selected-tags[data-v-05976cfe] {
    border: 0;
  }
  /deep/.el-textarea__inner {
    border: 0 !important;
    &::placeholder {
      color: #fff !important;
    }
  }

  /deep/.stl-big-data-select .selected-tags.disabled[data-v-05976cfe] {
    background-color: #fff;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #fff;
  }
  /deep/.el-input__count {
    display: none;
  }
  /deep/.el-input__prefix {
    display: none;
  }
  /deep/.el-icon-arrow-down {
    display: none;
  }
}
</style>
