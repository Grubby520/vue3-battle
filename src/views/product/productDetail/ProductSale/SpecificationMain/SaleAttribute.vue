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
                  :rules="{required: true, message: '域名不能为空', trigger: 'blur' }"
                >
                  <template slot="label">
                    <el-tooltip effect="dark" :content="item.name" placement="top">
                      <span class="form-label pointer-enable">{{item.name}}</span>
                    </el-tooltip>
                  </template>
                  <SlSelect
                    :options="colorOptions"
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
                <el-form-item :prop="`${index}values`" :rules="rules.sizes">
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
                    @close="removeSizeTag(tag)"
                  >{{tag.name}}</el-tag>
                </el-form-item>
              </template>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="addBtn" disabled>
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
      <!-- 批量设置弹窗 -->
      <!-- <BatchAttributes @hide="hideDialog" ref="batchAttributes" /> -->
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script>
import ProductSizeDialog from '../ProductSizeDialog'
// import BatchAttributes from '../batchAttributes'
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
      colorOptions: [], // 颜色下拉框数据
      sizeOptions: [],
      specificationOptions: [],
      saleLabelSign: ['size', 'color', 'specification'],
      categoryDataStatus: false,
      stashTableData: new Map(), // 临时缓存表格数据
      showSaleLabel: { // 展示销售属性标识
        size: '',
        color: '',
        specification: '',
        sizedeleted: false,
        colordeleted: false,
        specificationdeleted: false,
        sizeUsable: true,
        colorUsable: true,
        specificationUsable: true,
        // 销售属性数据是否已经加载完毕
        done: false
      },
      tableLabel: {}, // 表头展示的销售属性name
      tableHeadData: [ // 表头字段
        {
          name: 'supplyPrice',
          label: '供货价格（RMB）',
          required: true,
          message: '',
          validateRule: function (rule, value, callback) {
            if (value) {
              if (Number(value) <= 0) {
                callback(new Error('供货价格不能为0'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入供货价格'))
            }
          }
        },
        {
          name: 'skuCode',
          label: '商家SKU编码',
          maxlength: 30
        },
        {
          name: 'tagSize',
          label: '商家吊牌尺码',
          maxlength: 30
        },
        {
          name: 'weight',
          label: '带包装重量（G）',
          required: true,
          message: '请输入带包装重量'
        }
      ],
      activeName: undefined,
      chooseSpecificationTerms: [], // 选中的规格
      curSaleAttrs: [], // 所有的销售属性
      specificationData: {},
      rules: {
        colors: [
          { required: true, message: '请添加尺码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail']),
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
      if (isEmpty(this.specificationOptions)) return
      const checkedSpecification = this.chooseSpecificationTerms
        .reduce((init, tab) => init.concat(tab.id), [])
      return this.specificationOptions
        .filter(specificationItem =>
          !checkedSpecification.includes(specificationItem.id)
        )
    },
    specification () {
      return (
        this.curSaleAttrs.find(attr => attr.saleAttributeType.value === 3) || {})
    },
    specificationRelateMap () {
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
      const specificationTerms = this.specification.terms || []
      return specificationTerms.filter(term =>
        [...this.specificationRelateMap.keys()].includes(term.id)
      )
    }
  },
  watch: {
    'productAttrFill': {
      handler () {
        this.initAttrData()
      },
      immediate: true
    }
  },
  methods: {
    initAttrData () {
      const mode = this.productParams.mode === 'create'
      const useCategoryData = mode ? this.filterUableSaleAttrs : this.categoryData
      // 销售属性排序
      const saleLevel = {
        'NZ012': { level: 1, label: '规格' },
        'NZ010': { level: 2, label: '颜色' },
        'NZ011': { level: 3, label: '尺码' }
      }
      this.curSaleAttrs = useCategoryData
        .filter(cate => ['NZ010', 'NZ012', 'NZ011'].includes(cate.extendCode))
        .map(sale => {
          sale.level = saleLevel[sale.extendCode].level
          sale.label = saleLevel[sale.extendCode].label
          sale.attributeTermId = sale.id
          return sale
        })
        .sort((a, b) => { return a.level - b.level })
      this.specificationData = this.curSaleAttrs.find(cur => cur.extendCode === 'NZ012')

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
    buildSaleData (showSaleLabel, item, type) {
      const { terms, name, usable, extendCode, id } = item
      this[`${type}Options`] = terms.map(term => {
        term.extendCode = extendCode
        if (!term.usable) {
          term.name = `${term.name}(已禁用)`
          term.disabled = true
        }
        return term
      })
      if (name) {
        showSaleLabel[type] = name
        showSaleLabel[`${type}Usable`] = usable
      }
      this.tableHeadData.unshift({
        id: id,
        name: type,
        usable: usable,
        label: name,
        extendCode: extendCode
      })
    },
    selectChange (e, specificationTerm, item) {
      this.attributeChange(specificationTerm, item)
    },
    removeSizeTag (tag) {
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
    },
    updateSizeData () {
      this.$store.commit('product/CHECKED_SIZES', this.currentSizes())
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
    result () {
      return new Promise(resolve => {
        resolve({ 'productSalesAttributes': this.form.productSalesAttributes || [] })
      })
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
    // 销售属性变动
    attributeChange (specificationTerm, item) {
      /**
       * 满足需求
       * 如果多个规格使用的是同一个属性，
       * 比如【颜色】，则第一个颜色选择值后默认带到其他规格下的【颜色】中，
       * 如果已经有值的【颜色】框不做填充更改；
       */
      this.chooseSpecificationTerms
        .filter(term => term.id !== specificationTerm.attributeTermId)
        .forEach(term => {
          term.saleAttrs
            .filter(attr => attr.attributeId === item.attributeId)
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
  }
  /deep/.el-input--small .el-input__inner {
    text-align: center;
  }
}
</style>
