<template>
  <div class="specification">
    <el-card>
      <div slot="header">
        <span>详情描述</span>
        {{activeName}}
      </div>
      <div class="product-detail-content">
        <el-tabs v-model="activeName" type="card" @tab-remove="handleRemove" @tab-add="addeee">
          <el-tab-pane
            v-for="(specificationItem ) in specificationTab"
            :key="specificationItem.name"
            :label="specificationItem.name"
            :name="specificationItem.code"
            closable
          >
            <el-form :model="form" ref="form" label-width="12rem">
              {{showSaleLabel.size}}
              <el-form-item
                :label="showSaleLabel.size"
                prop="sizes"
                :rules="[{required: true, message: '请添加尺码', trigger:'blur' }]"
                v-if="showSaleCondition('size')"
              >
                <template slot="label">
                  <el-tooltip effect="dark" :content="showSaleLabel.size" placement="top">
                    <span class="form-label pointer-enable">{{showSaleLabel.size}}</span>
                  </el-tooltip>
                </template>
                <span
                  class="ProductSale-sizes"
                  v-if="productParams.mode!=='view'"
                  @click="openDialog('size',showSaleLabel)"
                >添加尺码</span>
                <el-tag
                  style="margin: 0 0 .5rem 1rem"
                  v-for="(tag, index) in form.sizes"
                  :key="index"
                  effect="dark"
                  :type="['success', 'info', 'danger', 'warning', ''][index%5]"
                  @close="removeSizeTag(tag)"
                >{{tag.name}}</el-tag>
              </el-form-item>
              <el-form-item
                :label="showSaleLabel.color"
                prop="colors"
                :rules="[{required: true, message: '请选择颜色', trigger:'change' }]"
                v-if="showSaleCondition('color')"
              >
                <template slot="label">
                  <el-tooltip effect="dark" :content="showSaleLabel.color" placement="top">
                    <span class="form-label pointer-enable">{{showSaleLabel.color}}</span>
                  </el-tooltip>
                </template>
                <SlSelect
                  :options="colorOptions"
                  v-model="form.colors"
                  label="name"
                  value="id"
                  filterable
                  multiple
                  clearable
                  isObj
                  placeholder="请选择颜色"
                  @change="selectChange($event, 'colors')"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane>
            <div slot="label">
              <el-dropdown trigger="click" @command="addSpecification">
                <el-button type="text">
                  <i class="el-icon-plus el-icon--left"></i> 亲子装规格
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in changeSpecificationOptions"
                    :key="`l${item.name}`"
                    :command="item"
                  >{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- 尺码弹框 -->
        <ProductSizeDialog ref="ProductSizeDialog" @confirm="sizeSelectConfirm" />
        <!-- 批量设置弹窗 -->
        <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
      </div>
    </el-card>
  </div>
</template>

<script>
import ProductSizeDialog from '../ProductSizeDialog'
import BatchAttributes from '../batchAttributes'
import { deepClone, isEmpty } from '@shared/util'
import { mapGetters } from 'vuex'
export default {
  components: { ProductSizeDialog, BatchAttributes },
  data () {
    return {
      colorOptions: [], // 颜色下拉框数据
      sizeOptions: [],
      specificationOptions: [],
      specificationTab: [], // 添加的规格
      tableHeadData: [],
      showSaleLabel: {},
      form: {},
      activeName: 0
    }
  },
  created () {

  },
  mounted () {
    // this.initAttrData()
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail']),
    /**
     * 规格为主属性，规格下拉数据处理
     */
    changeSpecificationOptions () {
      if (isEmpty(this.specificationOptions)) return
      const checkedSpecification = this.specificationTab.reduce((init, tab) => init.concat(tab.id), [])
      console.log('specificationOptions', this.specificationOptions)
      return this.specificationOptions.filter(specificationItem => !checkedSpecification.includes(specificationItem.id))
    },
    productAttrFill () {
      // 回显数据
      return [this.categoryData, this.productSalesAttributeDetail]
    }
  },
  watch: {
    'productAttrFill': {
      handler (newValue) {
        this.initAttrData()
      }
    }
  },
  methods: {
    /**
    * 创建时过滤禁用的销售属性和属性值，编辑使用请求数据处理
    */
    initAttrData () {
      const mode = this.productParams.mode === 'create'
      const useCategoryData = mode ? this.filterUableSaleAttrs() : this.categoryData
      useCategoryData.forEach(item => {
        switch (item.extendCode) {
          // 规格
          case 'NZ012':
            this.buildSaleData(this.showSaleLabel, item, 'specification')
            break
          // 颜色
          case 'NZ010':
            this.buildSaleData(this.showSaleLabel, item, 'color')
            break
          // 尺码
          case 'NZ011':
            this.buildSaleData(this.showSaleLabel, item, 'size')
            this.$store.commit('product/SIZE_ATTR', {
              name: item.name,
              attributeId: item.id,
              terms: item.terms,
              usable: item.usable
            })
            break
          default:
            // 商品属性（其他属性）
            const customAttributesData = useCategoryData.filter(item => item.type.value === 4)
            this.$store.commit('product/CUSTOM_ATTRIBUTES_DATA', customAttributesData)
            this.$store.commit('product/SHOW_SALE_LABEL', { size: this.showSaleLabel.size })
        }
      })
    },
    filterUableSaleAttrs () {
      // 创建时过滤禁用的属性和属性值
      const categoryData = deepClone(this.categoryData)
        .filter(categoryItem => categoryItem.usable)
        .reduce((init, categoryItem) => {
          categoryItem.terms = categoryItem.terms
            .filter(term => term.usable)
          init.push(categoryItem)
          return init
        }, [])
      return categoryData || []
    },
    /**
  * 构建销售属性表头/销售属性展示label/下拉赋值
  */
    buildSaleData (showSaleLabel, item, type) {
      const { terms, name, usable, extendCode, id } = item
      this[`${type}Options`] = terms
      if (type === 'specification') {
        this.activeName = terms[0].code
      }
      console.log(type, terms)
      if (name) {
        showSaleLabel[type] = name
      }
      this.tableHeadData.unshift({
        id: id,
        name: type,
        usable: usable,
        label: name,
        extendCode: extendCode
      })
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      this.updateSizeData()
    },
    updateSizeData () {
      this.$store.commit('product/CHECKED_SIZES', this.form.sizes)
      this.$refs.form.validateField('sizes')
    },
    /**
     * 批量录入回填
     * @param {Array} val 需要回填的数据
     */
    hideDialog (val) {
      const { skuList, supplyPrice, sizeList } = val
      // 颜色和供货价格
      let hasNeedSku = skuList.length > 0 && supplyPrice
      let sizeMap = new Map()
      sizeList.forEach((size) => {
        // 尺码和重量
        if (size.weight) sizeMap.set(size.attributeTermId, size.weight)
      })
      this.form.productSalesAttributes.forEach(item => {
        let saleAttrIds = []
        item.productCategorySalesAttributes.forEach((attribute) => {
          saleAttrIds.push(attribute.attributeTermId)
        })
        const includeBatchColor = saleAttrIds.find(i => skuList.includes(i))
        const includeBatchSize = saleAttrIds.find(i => sizeMap.get(i))
        if (hasNeedSku && includeBatchColor) this.$set(item, 'supplyPrice', supplyPrice)
        if (includeBatchSize) this.$set(item, 'weight', sizeMap.get(includeBatchSize))
      })
    },
    // 新增规格
    addSpecification (item) {
      this.specificationTab.push(item)
    },
    // 删除规格
    handleRemove (currentId) {
      this.$confirm('确认删除该规格吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          this.specificationTab = this.specificationTab.filter(tab => tab.code !== currentId)
        })
        .catch(() => { })
    },
    openDialog (type, showSaleLabel) {
      let dialog = null
      let data = []
      switch (type) {
        // 批量录入弹框
        case 'batchAttributes':
          dialog = this.$refs.batchAttributes
          data = this.form
          break
        // 选择尺寸弹框
        case 'size':
          dialog = this.$refs.ProductSizeDialog
          const { sizes } = this.form
          data = {
            'sizeOptions': this.sizeOptions || [],
            'formSizes': sizes || [],
            'showSaleLabel': showSaleLabel
          }
      }
      dialog.open(data)
      dialog = null
    },
    selectChange (e, attribute) {
      this.$refs.form.validateField(attribute) // 重新校验表单
    },
    removeSizeTag (tag) {
      this.form.sizes = this.form.sizes.filter(item => item.id !== tag.id)
      this.updateSizeData()
    },
    showSaleCondition (status) {
      return this.showSaleLabel[status]
    }
  }
}
</script>

<style scoped lang="scss">
.specification {
  &-btn {
    /deep/.el-tabs__item .el-icon-close {
      display: none;
    }
  }
}
</style>
