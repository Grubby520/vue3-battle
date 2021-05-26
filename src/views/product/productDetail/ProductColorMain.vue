<template>
  <div class="ProductSale">
    <el-card>
      <div slot="header" class="title">
        <span>销售属性</span>
      </div>
      <el-alert
        v-if="showAttrHint"
        title="销售属性不能为空"
        type="error"
        effect="dark"
        style="margin-bottom: 1rem;"
      />
      <p v-if="showAttrHint" class="align-center no-data">~暂无数据~</p>
      <div class="form" v-else>
        <el-form :model="form" ref="form" label-width="12rem" class="ProductSale-form">
          <el-form-item
            :label="showSaleLabel.color"
            v-if="showSaleCondition('color')"
            prop="colors"
            :rules="[{required: true, message: '请选择颜色', trigger:'change' }]"
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
              :disabled="disabledSaleAttr('color')"
              placeholder="请选择颜色"
              @change="selectChange($event, 'colors')"
            />
          </el-form-item>
          <el-form-item
            :label="showSaleLabel.size"
            v-if="showSaleCondition('size')"
            prop="sizes"
            :rules="[{required: true, message: '请添加尺码', trigger:'blur' }]"
          >
            <template slot="label">
              <el-tooltip effect="dark" :content="showSaleLabel.size" placement="top">
                <span class="form-label pointer-enable">{{showSaleLabel.size}}</span>
              </el-tooltip>
            </template>
            <span
              class="ProductSale-sizes"
              v-if="productParams.mode!=='view'"
              @click="openDialog('size',!showSaleLabel[`sizeUsable`],showSaleLabel)"
            >添加尺码</span>
            <el-tag
              style="margin: 0 0 .5rem 1rem"
              v-for="(tag, index) in form.sizes"
              :key="index"
              :closable="!disabledSaleAttr('size')"
              effect="dark"
              :type="['success', 'info', 'danger', 'warning', ''][index%5]"
              @close="removeSizeTag(tag)"
            >{{tag.name}}</el-tag>
          </el-form-item>
          <el-form-item
            :label="showSaleLabel['specification']"
            prop="specifications"
            v-if="showSaleCondition('specification')"
            :rules="[{required: true, message: '请选择', trigger:'change' }]"
          >
            <template slot="label">
              <el-tooltip effect="dark" :content="showSaleLabel.specification" placement="top">
                <span class="form-label pointer-enable">{{showSaleLabel.specification}}</span>
              </el-tooltip>
            </template>
            <SlSelect
              :options="specificationOptions"
              ref="specification"
              v-model="form.specifications"
              label="name"
              value="id"
              filterable
              multiple
              clearable
              isObj
              :disabled="disabledSaleAttr('specification')"
              placeholder="请选择规格"
              @change="selectChange($event, 'specifications')"
            />
          </el-form-item>
          <div class="ProductSale-table">
            <el-table :data="form.productSalesAttributes" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="`${item.label}${index}`"
                :width="item.width"
                align="center"
              >
                <template slot="header">
                  <span
                    class="ProductSale-from__icon"
                    v-if="['supplyPrice','weight','tagSize'].includes(item.name)"
                  >*</span>
                  <span>{{item.label}}</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="`productSalesAttributes.${scope.$index}.${item.name}`"
                    :rules="[{required: item.required, message: `${item.message}`, validator:item.validateRule, trigger:['blur','change' ]}]"
                    class="flex-center"
                  >
                    <template v-if="item.extendCode">
                      <!-- 动态销售属性(尺码/规格/颜色) -->
                      <div
                        v-for="(tableAttr,index) in scope.row.productCategorySalesAttributes"
                        :key="index"
                      >
                        <span
                          v-if="(tableLabel[`${tableAttr.attributeTermId}`]).extendCode === item.extendCode"
                        >{{tableLabel[`${tableAttr.attributeTermId}`].name}}</span>
                      </div>
                    </template>
                    <!-- 供货价格/sku/吊牌/带包装 -->
                    <el-input
                      v-else
                      v-model.trim="scope.row[item.name]"
                      :maxlength="item.maxlength"
                      v-slFormatNumber="['supplyPrice','weight'].includes(item.name) ? numberRule[item.name] :''"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="ProductSale-from__batch">
              <SlSpace />
              <el-button
                type="primary"
                @click="openDialog('batchAttributes')"
                v-if="productParams.mode!== 'view'"
              >批量录入</el-button>
            </el-row>
          </div>
        </el-form>
      </div>
      <!-- 尺码弹框 -->
      <ProductSizeDialog ref="ProductSizeDialog" @confirm="sizeSelectConfirm" />
      <!-- 批量设置弹窗 -->
      <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
    </el-card>
  </div>
</template>

<script>
import ProductSizeDialog from './ProductSizeDialog'
import BatchAttributes from './batchAttributes'
import { deepClone, isEmpty } from '@shared/util'
import { mapGetters } from 'vuex'
export default {
  components: { ProductSizeDialog, BatchAttributes },
  data () {
    return {
      form: {
        productSalesAttributes: [],
        sizes: [], // 尺寸选中数据
        colors: [],
        specifications: []
      },
      colorOptions: [], // 颜色下拉框数据
      sizeOptions: [],
      specificationOptions: [],
      saleLabelSign: ['size', 'color', 'specification'],
      categoryDataStatus: false,
      stashTableData: new Map(), // 临时缓存表格数据
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
          maxlength: 30,
          required: true,
          message: '请输入商家吊牌尺码'
        },
        {
          name: 'weight',
          label: '带包装重量（G）',
          required: true,
          message: '请输入带包装重量',
          maxlength: 30
        }
      ],
      numberRule: {
        'supplyPrice': { type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 99999999, compareLength: true, includeZero: true }
      }
    }
  },
  computed: {
    ...mapGetters('product', [
      'productParams',
      'categoryData',
      'productSalesAttributeDetail',
      'categoryId',
      'saleAttrs',
      'comparisonSaleAttrs',
      'specificationMain'

    ]),
    changeForm () {
      const saleAttrArr = []
      const sizes = deepClone(this.form.sizes)
      const colors = deepClone(this.form.colors)
      const specifications = deepClone(this.form.specifications)
      const saleTypes = { 'color': colors, 'size': sizes, 'specification': specifications }
      Object.keys(saleTypes).forEach(saleType => {
        !isEmpty(saleTypes[saleType]) && saleAttrArr.push(saleTypes[saleType])
      })
      return { saleAttrArr }
    },
    showTable () {
      // 多个属性，需要都选择值以后数据插入表格中
      const saleLens = this.saleLabelSign
        .reduce((lens, sign) => {
          const length = this.form[`${sign}s`].length
          if (this.showSaleLabel[`${sign}`] && length > 0) {
            lens.push(length)
          }
          return lens
        }, [])
      return !isEmpty(saleLens) && saleLens.every(item => item && item > 0)
    },
    showAttrHint () {
      // 判断是否有销售属性
      const hasSaleAttributes = this.curSaleAttrs.length === 0
      return hasSaleAttributes && this.productParams.mode === 'create'
    },
    productAttrFill () {
      // 回显数据
      return [this.curSaleAttrs, this.productSalesAttributeDetail]
    },
    coloerRelatedSizes () {
      return this.curSaleAttrs
        .find(attr =>
          attr.saleAttributeType && attr.saleAttributeType.value === 1
        ) || {}
    },
    curSaleAttrs () {
      return this.productParams.mode === 'create' ? this.saleAttrs : this.comparisonSaleAttrs
    },
    showSaleLabel () {
      return this.curSaleAttrs.reduce((init, sale) => {
        const saleType = {
          'NZ010': 'color',
          'NZ011': 'size',
          'NZ012': 'specification'
        }
        const { usable = false, deleteSale = false, name, extendCode } = sale
        Object.assign(init, {
          [saleType[extendCode]]: name,
          [`${saleType[extendCode]}Deleted`]: deleteSale,
          [`${saleType[extendCode]}Usable`]: usable
        })
        return init
      }, {})
    },
    disabledSaleAttr () {
      return (type) => {
        const deleteSale = this.showSaleLabel[`${type}Deleted`]
        const usableSale = this.showSaleLabel[`${type}Usable`]
        return !usableSale && !deleteSale
      }
    }
  },
  watch: {
    'changeForm': {
      // 监听尺码/颜色/规格变化
      handler ({ saleAttrArr }) {
        // 多个属性都选择了数据数据添加到table中，否则就重置table
        this.form.productSalesAttributes = this.showTable ? this.addTableItems(saleAttrArr) : []
      },
      immediate: true,
      deep: true
    },
    'productAttrFill': {
      handler (newValue) {
        const [curSaleAttrs, productSalesAttributeDetail] = deepClone(newValue)
        if (this.tableHeadData.length === 4) this.initAttrData()
        if (isEmpty(curSaleAttrs)) return
        if (!isEmpty(productSalesAttributeDetail)) {
          const saleTypes = {
            'NZ011': ['size', 'sizes'],
            'NZ010': ['color', 'colors'],
            'NZ012': ['specification', 'specifications']
          }
          const { productSalesAttributes, productCategorySalesAttributeSelectedList } = productSalesAttributeDetail
          this.form.productSalesAttributes = productSalesAttributes
          const productCategoryList = productCategorySalesAttributeSelectedList.map(productItem => {
            productItem.attributeTerms.forEach(term => {
              Object.assign(term, {
                attributeId: productItem.attributeId,
                extendCode: productItem.attribute.extendCode
              })
            })
            return productItem
          })
          productCategoryList.forEach(productSaleAttr => {
            const { extendCode } = productSaleAttr.attribute
            const formSaleType = saleTypes[`${extendCode}`][1]
            const optionType = saleTypes[`${extendCode}`][0]
            this.changeSaleAttrTerms(productSaleAttr, optionType, formSaleType)
          })
        }
        this.tableHeadData.forEach(head => {
          if (head.extendCode) {
            const currentSale = this.curSaleAttrs
              .find(sale => head.extendCode === sale.extendCode)
            if (currentSale.deleteSale) {
              head.label = `${head.label}(已删除)`
            } else {
              if (!currentSale.usable) {
                head.label = `${head.label}(已禁用)`
              }
            }
          }
        })
        this.showSaleLabel.done = true
      },
      immediate: true
    }
  },
  methods: {
    initAttrData () {
      const sortHead = []
      let head = {}
      this.curSaleAttrs.forEach(item => {
        switch (item.extendCode) {
          // 规格
          case 'NZ012':
            head = this.buildSaleData(item, 'specification')
            sortHead.push(head)
            break
          // 颜色
          case 'NZ010':
            head = this.buildSaleData(item, 'color')
            sortHead.push(head)
            break
          // 尺码
          case 'NZ011':
            head = this.buildSaleData(item, 'size')
            this.$store.commit('product/SIZE_ATTR', {
              name: item.name,
              attributeId: item.id,
              terms: item.terms,
              usable: item.usable
            })
            sortHead.push(head)
            break
        }
      })
      const tableSort = sortHead.sort((a, b) => { return a.saleAttributeType - b.saleAttributeType })
      this.tableHeadData.unshift(...tableSort)
    },
    /**
    * 构建销售属性表头/销售属性展示label/下拉赋值
    */
    buildSaleData (item, type) {
      const { terms, usable, extendCode, id, saleAttributeType } = item
      this[`${type}Options`] = terms
      const headName = {
        'NZ010': '颜色',
        'NZ011': '尺码',
        'NZ012': '规格'
      }
      return {
        id: id,
        name: type,
        usable: usable,
        label: headName[extendCode],
        extendCode: extendCode,
        saleAttributeType: saleAttributeType && saleAttributeType.value
      }
    },
    /**
    * 判断销售属性值是删除还是禁用
    */
    isSaleTermsStatus (attributeId, termId) {
      const attribute = this.categoryData
        .find(cateTerm => cateTerm.id === attributeId) || {}
      if (isEmpty(attribute)) {
        return { isDeleted: true }
      }
      const term = attribute.terms.find(term => term.id === termId)
      if (isEmpty(term)) {
        return { isDeleted: true }
      }
      return { isUsable: term.usable }
    },
    changeSaleAttrTerms (productSaleAttr, optionType, formSaleType) {
      this.curSaleAttrs
        .filter(sale => sale.id === productSaleAttr.attributeId)
        .forEach(sale => {
          const currentSaleTermIds = productSaleAttr.attributeTerms
            .reduce((init, term) => init.concat(term.id), [])
          const terms = sale.terms.filter(term => currentSaleTermIds.includes(term.id))
          this.form[formSaleType] = terms
          this[`${optionType}Options`] = sale.terms
        })
      if (formSaleType === 'sizes') this.$store.commit('product/CHECKED_SIZES', this.form[formSaleType])
    },
    selectChange (e, attribute) {
      this.$refs.form.validateField(attribute) // 重新校验表单
    },
    removeSizeTag (tag) {
      this.form.sizes = this.form.sizes.filter(item => item.id !== tag.id)
      this.updateSizeData()
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      this.updateSizeData()
    },
    updateSizeData () {
      this.$store.commit('product/CHECKED_SIZES', this.form.sizes)
      this.$refs.form.validateField('sizes')
    },
    openDialog (type, usable, showSaleLabel) {
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
          const { sizes, specifications } = this.form
          data = {
            'sizeOptions': this.sizeOptions || [],
            'formSizes': sizes || [],
            'specifications': specifications || [],
            'usable': usable,
            'showSaleLabel': showSaleLabel
          }
      }
      dialog.open(data)
      dialog = null
    },
    /**
     * 添加尺寸、颜色、规格添加表格数据
     */
    addTableItems (attrArr) {
      let resultArry = []
      const tableLabel = {}
      if (attrArr.length > 0) {
        attrArr.forEach((saleAttrItem) => {
          // * 当前销售属性项的长度为空则继续遍历下一项
          if (saleAttrItem && saleAttrItem.length === 0) return
          // * 如果是第一次遍历，则第一个销售属性的值依次插入array
          if (resultArry.length === 0) {
            saleAttrItem.forEach(item => {
              this.$set(tableLabel, item.id, item)
              resultArry.push([{ attributeTermId: item.id, attributeId: item.attributeId }])
            })
          } else {
            const emptyArray = []
            resultArry.forEach((item) => {
              saleAttrItem.forEach((value) => {
                if (Array.isArray(item)) { // * 从最外层第三次开始每次遍历都是走这里
                  this.$set(tableLabel, value.id, value)
                  emptyArray.push([...item, { attributeTermId: value.id, attributeId: value.attributeId }])
                } else { // * 只有最外层的第二次遍历才会调用这个，之后的数据都是数组格式
                  this.$set(tableLabel, item.id, item, value.id, value)
                  emptyArray.push([
                    { attributeTermId: item.id, attributeId: item.attributeId },
                    { attributeTermId: value.id, attributeId: value.attributeId }
                  ])
                }
              })
            })
            resultArry = emptyArray
          }
        })
        this.tableLabel = tableLabel
        const result = resultArry.map(item => {
          return {
            productCategorySalesAttributes: item
          }
        })
        this.form.productSalesAttributes = this.productSalesAttributeDetail.productSalesAttributes || []
        return this.stashTableInfo(result)
      }
    },
    /**
     * 批量录入回填
     * @param {Array} val 需要回填的数据
     */
    hideDialog (val) {
      const { sizeList, skuList, specifications, supplyPrice, weight } = val
      const checkedIds = [...sizeList, ...skuList, ...specifications]
      if (checkedIds.length > 0 && (supplyPrice || weight)) {
        this.form.productSalesAttributes.forEach((item, index) => {
          const saleTermsRowIds = item.productCategorySalesAttributes
            .reduce((init, attr) => init.concat(attr.attributeTermId), [])
          const isMatchCheck = checkedIds.some(id => saleTermsRowIds.includes(id))
          if (isMatchCheck) {
            supplyPrice &&
              this.$set(
                this.form.productSalesAttributes[index],
                'supplyPrice',
                supplyPrice
              )
            weight &&
              this.$set(
                this.form.productSalesAttributes[index],
                'weight',
                weight
              )
          }
        })
      }
    },
    /**
      * 暂存尺码销售属性之前的记录
      */
    stashLastData () {
      if (!isEmpty(this.form.productSalesAttributes)) {
        this.form.productSalesAttributes.forEach(tableItem => {
          const salesAttributeIds = tableItem.productCategorySalesAttributes.reduce((init, stash) => init.concat(stash.attributeTermId), []).join('')
          this.stashTableData.set(`${salesAttributeIds}`, tableItem)
        })
      }
    },
    /**
     * 销售属性变化根据暂存数据/编辑状态进行回显赋值
     * * @param {Array} saleData 销售属性变化后的数据结构
     */
    stashTableInfo (saleData) {
      this.stashLastData()
      if (!isEmpty(saleData)) {
        const showDatas = deepClone(saleData)
        showDatas.map(tableItem => {
          const tableItemIds = tableItem.productCategorySalesAttributes.reduce((init, stash) => init.concat(stash.attributeTermId), []).join('')
          const value = this.stashTableData.get(`${tableItemIds}`)
          Object.assign(tableItem, value)
        })
        return showDatas
      }
    },
    /**
    *  是否隐藏当前销售属性
    * * @param {String} status 销售属性类别
    */
    showSaleCondition (status) {
      let show = false
      // 避免三个销售属性都没有值的情况
      if (this.showSaleLabel.done) {
        // 是否有属性值
        const hasAttr = (this.form[`${status}s`] || []).length > 0
        const isDeleted = this.showSaleLabel[`${status}deleted`]
        const isUsable = this.showSaleLabel[`${status}Usable`]
        // 属性被删除或已禁用且没有值
        if ((isDeleted || !isUsable) && !hasAttr) {
          delete this.showSaleLabel[status]
          delete this.showSaleLabel[`${status}deleted`]
          this.$set(this.showSaleLabel, `${status}Usable`, true)
          this[`${status}Options`] = []
          // 重新触发排列组合
          this.form[`${status}s`] = []
          // 删除表头信息
          const delIndex = this.tableHeadData.findIndex(head => head.name === status)
          if (delIndex !== -1) this.tableHeadData.splice(delIndex, 1)
        }
        // 正常可用属性
        const avaliableAttribute = this.showSaleLabel[status] && isUsable && !isDeleted
        // 已禁用或已删除但是有选中的值
        const disableButHasValue = (!isUsable || isDeleted) && hasAttr > 0
        show = avaliableAttribute || disableButHasValue
      }
      return show
    },
    result () {
      return new Promise(resolve => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { mainAttribute, id } = this.coloerRelatedSizes
            const productMainAttributeAndTerm = {}
            if (mainAttribute) {
              productMainAttributeAndTerm['mainAttributeId'] = id
            }
            resolve({
              'productSalesAttributes': {
                productSalesAttributes: this.form.productSalesAttributes,
                productMainAttributeAndTerm: productMainAttributeAndTerm
              } || []
            })
          }
        })
      })
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
