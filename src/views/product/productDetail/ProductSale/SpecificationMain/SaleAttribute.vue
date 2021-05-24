<template>
  <div class="specification">
    <el-alert
      v-if="noRelatedSize.length>0"
      title="主属性为规格时，所有规格值必须关联尺码"
      type="warning"
      style="margin-bottom:1rem;"
    />
    <el-tabs
      class="pointer-enable"
      v-model="activeName"
      type="card"
      @tab-remove="handleRemove"
      v-if="this.specificationTerms.length > 0"
    >
      <el-tab-pane
        v-for="(specificationItem ) in chooseSpecificationTerms"
        :key="specificationItem.code"
        :label="specificationItem.name"
        :name="specificationItem.code"
        :closable="productParams.mode!=='view'"
      >
        <el-form ref="form" label-width="12rem" :model="specificationItem">
          <div v-for="(item, index) in specificationItem.saleAttrs" :key="index">
            <template v-if="item.extendCode ==='NZ010'">
              <el-form-item
                :prop="`${index}values`"
                :rules="{required: true, message: '颜色不能为空', trigger: 'blur' }"
              >
                <template slot="label">
                  <el-tooltip effect="dark" :content="item.name" placement="top">
                    <span class="form-label pointer-enable">{{item.name}}</span>
                  </el-tooltip>
                </template>
                <div :style="skuConentHeight">
                  <SlSelect
                    v-model="item.values"
                    :options="item.terms"
                    :maxHeight="200"
                    filterable
                    value="id"
                    label="name"
                    :disabled="disableAttrSelect(item)"
                    :defaultValues="item.defaultValues || []"
                    multiple
                    @change="selectChange(specificationItem, item)"
                    @toggleDrop="handleToggle"
                  ></SlSelect>
                </div>
              </el-form-item>
            </template>
            <template v-if="item.extendCode ==='NZ011'">
              <el-form-item
                :prop="`${index}values`"
                :rules="{required: true, message: '尺寸不能为空', trigger: 'blur' }"
              >
                <template slot="label">
                  <el-tooltip effect="dark" :content="item.name" placement="top">
                    <span class="form-label pointer-enable">{{item.name}}</span>
                  </el-tooltip>
                </template>
                <span
                  v-if="productParams.mode!=='view'"
                  class="specification-size"
                  @click="openDialog('productSizeDialog',item.terms,{specificationItem, item})"
                >添加尺码</span>
                <el-tag
                  style="margin: 0 0 .5rem 1rem"
                  v-for="(tag, index) in item.values"
                  :key="index"
                  :closable="productParams.mode!=='view'"
                  effect="dark"
                  :type="['success', 'info', 'danger', 'warning', ''][index%5]"
                  @close="removeSizeTag(tag,specificationItem, item)"
                >{{tag.name}}</el-tag>
              </el-form-item>
            </template>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="addBtn" disabled v-if="changeSpecificationOptions.length>0">
        <div slot="label">
          <el-dropdown trigger="click" @command="handleAdd">
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
    <div class="no-data" v-else>
      <span class="no-data--tip">~暂无数据~</span>
    </div>
    <!-- 尺码弹框 -->
    <ProductSizeDialog ref="productSizeDialog" @confirm="sizeSelectConfirm" />
  </div>
</template>

<script>
import ProductSizeDialog from '../../ProductSizeDialog'
import { deepClone, isEmpty } from '@shared/util'
import { mapGetters } from 'vuex'
export default {
  components: { ProductSizeDialog },
  data () {
    return {
      form: {
        productSalesAttributes: [],
        saleHead: []
      },
      activeName: undefined,
      chooseSpecificationTerms: [], // 选中的规格
      panelMinHeight: 0 // select容器最小高度
    }
  },
  computed: {
    ...mapGetters('product', [
      'productParams',
      'categoryData',
      'categoryId',
      'productSalesAttributeDetail',
      'productMainAttributeAndTerm',
      'extraAttrMap',
      'saleAttrs',
      'comparisonSaleAttrs'
    ]),
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
    changeSpecificationOptions () {
      if (isEmpty(this.specification)) return
      const terms = this.specification.terms
      // 回显选中的规格属性值
      const checkedSpecificationIds = this.chooseSpecificationTerms
        .reduce((init, specification) => init.concat(specification.id), [])
      return terms
        .filter(term => !checkedSpecificationIds.includes(term.id))
        .filter(term => !this.noRelatedSize.includes(term.id))
    },
    noRelatedSize () {
      return (this.specification.categoryAttributeRelatedSizes || [])
        .filter(size => !size.relatedSizeId)
        .reduce((init, size) => init.concat(size.termId), [])
    },
    specification () {
      // 分类上的规格
      return this.curSaleAttrs.find(attr => attr.saleAttributeType && attr.saleAttributeType.value === 3) || {}
    },
    specificationRelateMap () {
      // 规格关联关系map
      const relateMap = new Map()
      const specificationRelate = this.specification
        .categoryAttributeRelatedSizes
      specificationRelate.forEach(relate => {
        if (relate.relatedSizeId) {
          relateMap.set(relate.termId, relate.relatedSizeId)
        }
      })
      return relateMap
    },
    specificationTerms () {
      // 规格属性值
      const specificationTerms = this.specification.terms || []
      return specificationTerms.filter(term =>
        [...this.specificationRelateMap.keys()].includes(term.id)
      )
    },
    skuConentHeight () {
      let attributeHeight = this.curSaleAttrs.length * 30
      attributeHeight = attributeHeight > 90 ? 90 : attributeHeight
      return {
        minHeight: `${this.panelMinHeight + attributeHeight}px`
      }
    },
    sizeMap () {
      return this.curSaleAttrs
        .filter(sale => sale.saleAttributeType && sale.saleAttributeType.value === 2)
        .map(attr => {
          const curMap = new Map()
          attr.terms.forEach(term => {
            curMap.set(term.id, term.name)
          })
          return curMap
        })[0]
    },
    curSaleAttrs () {
      return this.productParams.mode === 'create' ? this.saleAttrs : this.comparisonSaleAttrs
    }
  },
  watch: {
    'categoryId': {
      handler (newValue) {
        if (newValue) {
          this.initData()
        }
      },
      immediate: true
    },
    'productMainAttributeAndTerm': {
      handler (newValue) {
        if (this.productParams.mode !== 'create' && newValue) {
          const productMainAttributeAndTerm = this.productMainAttributeAndTerm.productMainAttributeTermRelationList
          if (!isEmpty(productMainAttributeAndTerm)) {
            this.activeName = `${productMainAttributeAndTerm[0].mainAttributeTermId}`
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化数据，只在编辑情况下执行
    initData () {
      const { productMainAttributeTermRelationList = [] } = deepClone(this.productMainAttributeAndTerm)
      if (isEmpty(productMainAttributeTermRelationList)) return
      this.chooseSpecificationTerms = productMainAttributeTermRelationList.map(
        (attributeTerm, index) => {
          const specificationTerm = deepClone(
            this.specificationTerms.find(
              term => {
                return term.id === attributeTerm.mainAttributeTermId
              }
            )
          )
          const saleAttributes = attributeTerm.relatedAttributeAndTermList.map(
            saleAttr => {
              const saleAttribute = deepClone(
                this.curSaleAttrs.find(
                  attr =>
                    attr.id ===
                    saleAttr.attributeId
                ) || {}
              )
              if (isEmpty(saleAttribute)) return
              const terms = saleAttribute.terms
                .filter(term => saleAttr.attributeTermIds.includes(term.id))
              let termIds = []
              const saleAttributeType = saleAttribute.saleAttributeType && saleAttribute.saleAttributeType.value
              if (saleAttributeType === 1) {
                termIds = terms.reduce((init, term) => init.concat(term.id), [])
              } else {
                termIds = terms
              }
              return {
                ...saleAttribute,
                values: termIds
              }
            }
          )
          return {
            ...specificationTerm,
            saleAttrs: saleAttributes
          }
        }
      )
      this.handleAttribute()
    },
    selectChange (specificationTerm, item) {
      this.attributeChange(specificationTerm, item)
    },
    removeSizeTag (tag, specificationTerm, item) {
      this.chooseSpecificationTerms.forEach(sale => {
        if (sale.code === this.activeName) {
          sale.saleAttrs.forEach((choose) => {
            if (choose.extendCode === 'NZ011') {
              let currentIndex = ''
              choose.values.forEach((value, index) => {
                if (value.id === tag.id) {
                  currentIndex = index
                }
              })
              choose.values.splice(currentIndex, 1)
            }
          })
        }
      })
      this.attributeChange(specificationTerm, item)
      this.productCheckedSize()
    },
    sizeSelectConfirm (val, currentChoose) {
      this.chooseSpecificationTerms.forEach(choose => {
        if (choose.code === this.activeName) {
          choose.saleAttrs.forEach(sale => {
            if (sale.extendCode === 'NZ011') {
              sale.values = val
            }
          })
        }
      })
      const { item, specificationItem } = currentChoose
      this.attributeChange(specificationItem, item)
      this.productCheckedSize()
    },
    /**
     * 销售属性选中的尺码
     */
    productCheckedSize () {
      const checkdSizes = []
      this.chooseSpecificationTerms.forEach(choose => {
        const attributeId = choose.attributeId
        choose.saleAttrs
          .filter(sale => sale.saleAttributeType.value === 2)
          .forEach(sale => {
            const values = sale.values.map(value => {
              value.attributeId = attributeId
              value.attributeTermId = value.id
              return value
            })
            checkdSizes.push(...values)
          })
      })
      this.$store.commit(`product/CHECKED_SIZES`, checkdSizes || [])
    },
    openDialog (ref, data, currentChoose) {
      let dialogData = {}
      let dialog = null
      let sizeData = {
        'sizeOptions': data || [],
        'formSizes': this.currentSizes() || [],
        'showSaleLabel': this.showSaleLabel || {},
        'currentChoose': currentChoose
      }
      dialogData = ref === 'productSizeDialog' ? sizeData : this.form
      dialog = this.$refs[ref]
      dialog.open(dialogData)
      dialog = null
    },
    // 新增规格
    handleAdd (specification) {
      const specificationItem = this.attachSaleAttribute(specification)
      this.chooseSpecificationTerms.push(specificationItem)
      this.activeName = specificationItem.code
      this.handleAttribute()
    },
    attachSaleAttribute (specificationTerm) {
      const specificationItem = deepClone(specificationTerm)
      const relateSizeId = this.specificationRelateMap.get(
        specificationItem.id
      )
      specificationItem.saleAttrs = this.curSaleAttrs
        .filter(
          attr => {
            return attr.saleAttributeType.value === 1 ||
              attr.id === relateSizeId
          }
        )
        .map(attr => {
          const saleAttribute = deepClone(attr)
          return {
            ...saleAttribute,
            values: []
          }
        })
        .sort((pre, suffix) => pre.saleAttributeType.value - suffix.saleAttributeType.value)
      return specificationItem
    },
    // 删除规格
    handleRemove (specificationCode) {
      this.$confirm('确定删除该规格吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          const index = this.chooseSpecificationTerms.findIndex(
            (item) => item.code === specificationCode
          )
          if (index > -1) {
            this.chooseSpecificationTerms.splice(index, 1)
          }

          if (this.activeName === specificationCode) {
            this.activeName = this.chooseSpecificationTerms[0].code
          }
          this.handleAttribute()
        })
        .catch(() => { })
    },
    currentSizes () {
      const currentSpecification = this.chooseSpecificationTerms
        .find(chooseAttr => chooseAttr.code === this.activeName)
      return currentSpecification.saleAttrs
        .reduce((init, chooseAttr) => {
          if (chooseAttr.extendCode === 'NZ011') {
            init = chooseAttr.values
          }
          return init
        }, [])
    },
    attributeChange (specificationTerm, item) {
      /**
       * 满足需求-销售属性变动
       * 如果多个规格使用的是同一个属性，
       * 比如【颜色】，则第一个颜色选择值后默认带到其他规格下的【颜色】中，
       * 如果已经有值的【颜色】框不做填充更改；
       */
      this.chooseSpecificationTerms
        .filter(term => term.id !== specificationTerm.id)
        .forEach(term => {
          term.saleAttrs
            .filter(attr => attr.id === item.id)
            .forEach(attr => {
              if (isEmpty(attr.values)) {
                attr.values = deepClone(item.values)
              }
            })
        })
      this.handleAttribute()
    },
    // 将数据进行加工并且执行回调
    handleAttribute (refreshTable = true) {
      const currentData = this.chooseSpecificationTerms.map(
        specificationTerm => {
          return {
            mainAttributeId: this.specification.id,
            mainAttributeTermId: specificationTerm.id,
            mainAttributeTermName: specificationTerm.name,
            relatedAttributeAndTermList: specificationTerm.saleAttrs.map(
              saleAttr => {
                let values = []
                if (this.productParams.mode === 'create') {
                  const saleAttributeType = saleAttr.saleAttributeType && saleAttr.saleAttributeType.value
                  const sizeIds = saleAttr.values.reduce((init, sale) => init.concat(sale.id), [])
                  values = saleAttributeType === 2 ? sizeIds : saleAttr.values
                } else {
                  values = saleAttr.values
                }
                return {
                  attributeId: saleAttr.id,
                  attributeTermIds: values
                }
              }
            )
          }
        }
      )
      this.$emit('change', currentData, refreshTable)
    },
    handleToggle (val) {
      this.panelMinHeight = val
    },
    disableAttrSelect () {

    },
    tagName (id) {
      return this.sizeMap.get(id)
    }
  }
}
</script>

<style scoped lang="scss">
.specification {
  &-size {
    color: #409eff;
    cursor: default;
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    .no-data--tip {
      flex: 1;
      text-align: center;
      color: #909399;
    }
  }
  /deep/.el-form-item--small.el-form-item {
    margin-bottom: -2rem;
  }
  /deep/.stl-big-data-select .selected-tags[data-v-05976cfe] {
    width: 95%;
  }
}
</style>
