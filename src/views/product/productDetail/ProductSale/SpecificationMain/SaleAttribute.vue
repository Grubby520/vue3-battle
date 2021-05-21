<template>
  <div class="specification">
    <div class="product-detail-content">
      <el-tabs v-model="activeName" type="card" @tab-remove="handleRemove">
        <el-tab-pane
          v-for="(specificationItem ) in chooseSpecificationTerms"
          :key="specificationItem.code"
          :label="specificationItem.name"
          :name="specificationItem.code"
          closable
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
                  <SlSelect
                    :options="item.terms"
                    v-model="item.values"
                    label="name"
                    value="id"
                    filterable
                    multiple
                    clearable
                    isObj
                    placeholder="请选择颜色"
                    @change="selectChange($event, specificationItem, item)"
                  />
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
                    class="ProductSale-sizes"
                    v-if="productParams.mode!=='view'"
                    @click="openDialog('productSizeDialog',item.terms,{specificationItem, item})"
                  >添加尺码</span>
                  <el-tag
                    style="margin: 0 0 .5rem 1rem"
                    v-for="(tag, index) in item.values"
                    :key="index"
                    closable
                    effect="dark"
                    :type="['success', 'info', 'danger', 'warning', ''][index%5]"
                    @close="removeSizeTag(tag,specificationItem, item)"
                  >{{tag.name}}</el-tag>
                </el-form-item>
              </template>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="addBtn" disabled v-if="productParams.mode==='create'">
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
      <!-- 尺码弹框 -->
      <ProductSizeDialog ref="productSizeDialog" @confirm="sizeSelectConfirm" />
    </div>
    <!-- </el-card> -->
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
      // curSaleAttrs: [], // 所有的销售属性
      rules: {
        colors: [
          { required: true, message: '请添加尺码', trigger: 'blur' }
        ]
      }
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
      'comparisonSaleInfo'
    ]),
    productAttrFill () {
      // 回显数据
      return [this.categoryData, this.productSalesAttributeDetail]
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
    changeSpecificationOptions () {
      if (isEmpty(this.specification)) return
      const checkedSpecification = this.chooseSpecificationTerms
        .reduce((init, tab) => init.concat(tab.id), [])
      return this.specification.terms
        .filter(specificationItem =>
          !checkedSpecification.includes(specificationItem.id)
        )
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
    curSaleAttrs () {
      return this.productParams.mode === 'create' ? this.saleAttrs : this.comparisonSaleInfo
      // return this.saleAttrs
    }
  },
  watch: {
    'categoryId': {
      handler (newValue) {
        if (newValue) {
          const { productCategorySalesAttributeSelectedList = [] } = deepClone(this.productSalesAttributeDetail)
          this.comparisonCateInfo(productCategorySalesAttributeSelectedList)
          this.initData()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化数据，只在编辑情况下执行
    initData () {
      const { productMainAttributeTermRelationList = [] } = deepClone(this.productMainAttributeAndTerm)
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
              const terms = saleAttribute.terms.filter(term => saleAttr.attributeTermIds.includes(term.id))
              return {
                ...saleAttribute,
                values: terms
              }
            }
          )
          return {
            ...specificationTerm,
            saleAttrs: saleAttributes
          }
        }
      )

      this.activeName = productMainAttributeTermRelationList[0].code
      this.handleAttribute()
    },
    /**
     * 对比分类判断销售属性和和属性值是否在分类上
     */
    comparisonCateInfo (productCategorySalesAttributeSelectedList) {
      productCategorySalesAttributeSelectedList.forEach(sale => {
        const cateSaleAttr = this.saleAttrs.find(attr => attr.id === sale.attributeId)
        if (cateSaleAttr) {
          // 判断销售属性分类上存在
          const cateTermIds = cateSaleAttr.terms.reduce((init, a) => init.concat(a.id), [])
          if (sale.attribute.usable) sale.attribute.name = `${sale.attribute.name}(已禁用)`
          sale.attributeTerms.forEach(attrTerm => {
            if (!cateTermIds.includes(attrTerm.id)) {
              attrTerm.name = `${attrTerm.name}(已删除)`
            } else {
              if (attrTerm.usable) attrTerm.name = `${attrTerm.name}(已禁用)`
            }
          })
        } else {
          sale.attribute.name = `${sale.attribute.name}(已删除)`
        }
      })
      console.log('1111111111111', deepClone(productCategorySalesAttributeSelectedList))
      this.buildSaveStructure(productCategorySalesAttributeSelectedList)
    },
    /**
     * 回显数据构建和分类相同的数据结构
     */
    buildSaveStructure (productCategorySalesAttributeSelectedList) {
      // 构建分类上规格主属性结构-categoryAttributeRelatedSizes
      const {
        productMainAttributeAndTerm = {}
      } = deepClone(this.productSalesAttributeDetail)
      const saleSizeIds = productCategorySalesAttributeSelectedList
        .reduce((init, size) => {
          const { saleAttributeType, id } = size.attribute
          if (saleAttributeType === 2) {
            init.push(id)
          }
          return init
        }, [])
      const productMainAttributeTermRelationList = productMainAttributeAndTerm.productMainAttributeTermRelationList
      const categoryAttributeRelatedSizes = productMainAttributeTermRelationList.map(relation => {
        const relatedSizeId = relation.relatedAttributeAndTermList.find(term => saleSizeIds.includes(term.attributeId)).attributeId
        const saleAttrRelation = {}
        saleAttrRelation['termId'] = relation.mainAttributeTermId
        saleAttrRelation['relatedSizeId'] = relatedSizeId
        return saleAttrRelation
      })
      // 构建分类销售属性结构
      const productCategorySalesAttribute = productCategorySalesAttributeSelectedList.map(sale => {
        // debugger
        const { attribute, attributeTerms, attributeId } = sale
        const saleTerms = { ...attribute }
        // 尺码表需要数据
        if (attribute.saleAttributeType === 2) {
          const saleTerms = attributeTerms.map(term => {
            const terms = {}
            terms['attributeId'] = attributeId
            terms['attributeTermId'] = term.id
            terms['attributeTermName'] = term.name
            return terms
          })
          console.log('attributeTerms', saleTerms)
          this.$store.commit(`product/SET_CHECKED_ATTRS`, saleTerms || [])
        }
        if (attribute.saleAttributeType === 3) {
          saleTerms['categoryAttributeRelatedSizes'] = categoryAttributeRelatedSizes
        }
        saleTerms['saleAttributeType'] = { 'value': attribute.saleAttributeType }
        saleTerms['terms'] = attributeTerms
        return saleTerms
      })
      console.log('productCategorySalesAttribute', deepClone(productCategorySalesAttribute))
      this.$store.commit(`product/COMPARISON_SALE_INFO`, productCategorySalesAttribute || [])
    },
    selectChange (e, specificationTerm, item) {
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
        'activeName': this.activeName,
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
                return {
                  attributeId: saleAttr.id,
                  attributeTermIds: saleAttr.values
                }
              }
            )
          }
        }
      )
      this.$emit('change', currentData, refreshTable)
    }
  }
}
</script>

<style scoped lang="scss">
.ProductSale {
  margin-bottom: 2rem;
  &-from {
    &__icon {
      display: inline-block;
      margin-right: 0.5rem;
      color: red;
    }
    &__batch {
      display: flex;
      margin-top: 1rem;
    }
  }
  &-table {
    padding: 0 0 0 12rem;
    /deep/.el-form-item__content {
      margin-left: 0 !important;
    }
  }
  &-sizes {
    color: #409eff;
    cursor: default;
  }
  .el-card {
    overflow: unset !important;
    height: 800px;
  }
  /deep/.el-input--small .el-input__inner {
    text-align: center;
  }
}
</style>
