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
            :label="showSaleLabel.size"
            v-if="showSaleCondition('size')"
            prop="sizes"
            :rules="[{required: true, message: '请添加尺码', trigger:'blur' }]"
          >
            <template slot="label">
              <el-tooltip effect="dark" :content="showSaleLabel.size" placement="top">
                <span class="form-label pointer-enable">{{showSaleLabel.size}}</span>
              </el-tooltip>
              <span
                class="form-label--tag"
                v-if="showSaleLabel.sizedeleted || !showSaleLabel.sizeUsable"
              >({{showSaleLabel.sizedeleted ? '已删除' : !showSaleLabel.sizeUsable ? '已禁用' : ''}})</span>
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
            :label="showSaleLabel.color"
            v-if="showSaleCondition('color')"
            prop="colors"
            :rules="[{required: true, message: '请选择颜色', trigger:'change' }]"
          >
            <template slot="label">
              <el-tooltip effect="dark" :content="showSaleLabel.color" placement="top">
                <span class="form-label pointer-enable">{{showSaleLabel.color}}</span>
              </el-tooltip>
              <span
                class="form-label--tag"
                v-if="showSaleLabel.colordeleted || !showSaleLabel.colorUsable"
              >({{showSaleLabel.colordeleted ? '已删除' : !showSaleLabel.colorUsable ? '已禁用' : ''}})</span>
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
            :label="showSaleLabel['specification']"
            prop="specifications"
            v-if="showSaleCondition('specification')"
            :rules="[{required: true, message: '请选择', trigger:'change' }]"
          >
            <template slot="label">
              <el-tooltip effect="dark" :content="showSaleLabel.specification" placement="top">
                <span class="form-label pointer-enable">{{showSaleLabel.specification}}</span>
              </el-tooltip>
              <span
                class="form-label--tag"
                v-if="showSaleLabel.specificationdeleted || !showSaleLabel.specificationUsable"
              >({{showSaleLabel.specificationdeleted ? '已删除' : !showSaleLabel.specificationUsable ? '已禁用' : ''}})</span>
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
              :disabled="disabledSaleAttr('specificationUsable')"
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
                    v-if="['supplyPrice','weight'].includes(item.name)"
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
                          v-if="(tableLabel[tableAttr.attributeTermId+'']).extendCode === item.extendCode"
                        >{{tableLabel[tableAttr.attributeTermId+''].name}}</span>
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
      noSaleAttributes: undefined,
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
      numberRule: {
        'supplyPrice': { type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 99999999, compareLength: true, includeZero: true }
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail']),
    changeForm () {
      const saleAttrArr = []
      const sizes = deepClone(this.form.sizes)
      const colors = deepClone(this.form.colors)
      const specifications = deepClone(this.form.specifications)
      const saleTypes = { 'size': sizes, 'color': colors, 'specification': specifications }
      Object.keys(saleTypes).forEach(saleType => {
        !isEmpty(saleTypes[saleType]) && saleAttrArr.push(saleTypes[saleType])
      })
      return saleAttrArr
    },
    showTable () {
      // 多个属性，需要都选择值以后数据插入表格中
      const saleLens = this.saleLabelSign
        .reduce((lens, sign) => {
          const length = this.form[`${sign}s`].length
          if (this.showSaleLabel[`${sign}`]) lens.push(length)
          return lens
        }, [])
      return !isEmpty(saleLens) && saleLens.every(item => item && item > 0)
    },
    showAttrHint () {
      return this.noSaleAttributes && this.productParams.mode === 'create'
    },
    productAttrFill () {
      return [this.categoryData, this.productSalesAttributeDetail]
    },
    filterUableSaleAttrs () {
      const categoryData = deepClone(this.categoryData)
        .filter(categoryItem => categoryItem.usable)
        .reduce((init, categoryItem) => {
          categoryItem.terms = categoryItem.terms
            .filter(term => term.usable)
          init.push(categoryItem)
          return init
        }, [])
      return categoryData || []
    }
  },
  watch: {
    'changeForm': {
      // 监听尺码/颜色/规格变化
      handler (newValue) {
        // 多个属性都选择了数据数据添加到table中，否则就重置table
        this.form.productSalesAttributes = this.showTable ? this.addTableItems(newValue) : []
      },
      immediate: true,
      deep: true
    },
    'productAttrFill': {
      handler (newValue) {
        const [categoryData, productSalesAttributeDetail] = deepClone(newValue)
        if (isEmpty(categoryData)) return
        if (this.tableHeadData.length === 4) this.initAttrData()
        if (!isEmpty(productSalesAttributeDetail)) {
          const saleTypes = {
            'NZ011': ['size', 'sizes'],
            'NZ010': ['color', 'colors'],
            'NZ012': ['specification', 'specifications']
          }
          const { productCategorySalesAttributeSelectedList = [], productSalesAttributes } = productSalesAttributeDetail
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
          if (!isEmpty(productCategoryList)) {
            productCategoryList.forEach(productSaleAttr => {
              const { extendCode, name, id } = productSaleAttr.attribute
              const formSaleType = saleTypes[`${extendCode}`][1]
              const optionType = saleTypes[`${extendCode}`][0]
              // 属性是否在表头中
              const attributeInHead = this.tableHeadData.some(head => head.id === id)
              // 属性的extendCode是否在表头中
              const extendCodeInHeadIndex = this.tableHeadData.findIndex(head => head.extendCode === extendCode)
              // 当前属性作为表头的数据格式
              const attributeHeadData = { name: optionType, label: name, extendCode: extendCode, id: id }
              // 当前类型的销售属性没在表头中
              if (extendCodeInHeadIndex === -1) {
                this.deletedProductAttrs(productSaleAttr, optionType, formSaleType)
                this.tableHeadData.unshift(attributeHeadData)
              } else if (!attributeInHead) { // 当前销售属性没有在表头中（分类的销售属性已全部加入到表头）
                this.deletedProductAttrs(productSaleAttr, optionType, formSaleType)
                this.tableHeadData.splice(extendCodeInHeadIndex, 1, attributeHeadData)
              } else { // 正常的数据
                this.deletedSaleAttrsTerms(productSaleAttr, optionType, formSaleType)
              }
            })
            this.$store.commit('product/SHOW_SALE_LABEL', this.showSaleLabel)
            this.refreshSaleLabel()
          }
        }
        this.showSaleLabel.done = true
      },
      immediate: true
    }
  },
  methods: {
    initAttrData () {
      /**
      * 创建时过滤禁用的销售属性和属性值，编辑使用请求数据处理
      */
      const mode = this.productParams.mode === 'create'
      const useCategoryData = mode ? this.filterUableSaleAttrs : this.categoryData
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
            this.$store.commit('product/SHOW_SALE_LABEL', this.showSaleLabel)
        }
      })
      // 判断是否有销售属性
      this.noSaleAttributes = useCategoryData.filter(attr => ['NZ012', 'NZ010', 'NZ011'].includes(attr.extendCode)).length === 0
    },
    /**
    * 构建销售属性表头/销售属性展示label/下拉赋值
    */
    buildSaleData (showSaleLabel, item, type) {
      const { terms, name, usable, extendCode, id } = item
      this[`${type}Options`] = terms.map(term => {
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
        name: type,
        label: name,
        extendCode: extendCode,
        id: id,
        usable: usable
      })
    }, /**
   * 判断销售属性值是删除还是禁用
   */
    isSaleTermsStatus (attributeId, termId) {
      const attribute = this.categoryData
        .find(cateTerm => cateTerm.id === attributeId) || {}
      if (isEmpty(attribute)) {
        console.error(`extendCode: ${attributeId} is not exsit in tree`)
        return { isDeleted: true }
      }
      const term = attribute.terms.find(term => term.id === termId)
      if (isEmpty(term)) {
        return { isDeleted: true }
      }
      return { isUsable: term.usable }
    },
    /**
    * 已经删除销售属性
    */
    deletedProductAttrs (productSaleAttr, optionType, formSaleType) {
      const saleName = productSaleAttr.attribute.name
      const attributeTerms = productSaleAttr.attributeTerms
      this.$set(this.showSaleLabel, optionType, saleName)
      this.$set(this.showSaleLabel, `${optionType}deleted`, true)
      const options = productSaleAttr.attributeTerms.map(attr => {
        attr.name = `${attr.name}(已删除)`
        return attr
      })
      this.refreshSaleAttrs(attributeTerms, formSaleType, optionType, options)
    },
    /**
    * 销售属性存在属性值可能被删除
    */
    deletedSaleAttrsTerms (productSaleAttr, optionType, formSaleType) {
      const deletedItems = []
      const attributeTermInfo = productSaleAttr.attributeTerms.map(attr => {
        const isSaleTermsStatus = this.isSaleTermsStatus(attr.attributeId, attr.id)
        if (isSaleTermsStatus.isDeleted) {
          attr.name = `${attr.name}(已删除)`
          deletedItems.push({ ...attr, name: attr.name, extendCode: attr.extendCode })
        } else {
          if (!isSaleTermsStatus.isUsable) {
            attr.name = `${attr.name}(已禁用)`
          }
        }
        return attr
      })
      const options = this[`${optionType}Options`]
      this.refreshSaleAttrs(attributeTermInfo, formSaleType, optionType, options, deletedItems)
    },
    refreshSaleAttrs (attributeTerms, formSaleType, optionType, options, deletedItems = []) {
      this.form[formSaleType] = attributeTerms
      this[`${optionType}Options`] = [...options, ...deletedItems]
      // 重新修改尺码表数据
      if (formSaleType === 'sizes') this.$store.commit('product/CHECKED_SIZES', this.form[formSaleType])
    },
    refreshSaleLabel () {
      this.saleLabelSign.forEach(label => {
        const isUsable = this.showSaleLabel[`${label}Usable`]
        const isDeleted = this.showSaleLabel[`${label}deleted`]
        const attrlabel = this.showSaleLabel[label]
        const formSaleAttr = this.form[`${label}s`] || []
        let hasAttr = formSaleAttr.length
        if (!isUsable && Object.keys(this.showSaleLabel).includes(`${label}Usable`)) {
          // 禁用
          // if (attrlabel) this.showSaleLabel[`${label}`] = `${attrlabel}(已禁用)`
          if (hasAttr > 0) {
            this.tableHeadData.forEach(head => {
              if (!isDeleted) {
                if (head.name === label) {
                  // head.label = `${head.label}(已禁用)`
                }
              }
            })
          } else {
            // 编辑状态如果有禁用属性表头删除禁用属性值
            let tableHeadData = this.tableHeadData
            const delIndex = tableHeadData.findIndex(headData => headData.name === label)
            tableHeadData.splice(delIndex, 1)
            this.tableHeadData = tableHeadData
          }
        }
        if (isDeleted) {
          this.tableHeadData.forEach(head => {
            if (head.name === label) {
              // head.label = `${head.label}(已删除)`
            }
          })
        }
        if (isDeleted && attrlabel.indexOf('已禁用') > 0) {
          this.showSaleLabel[label] = attrlabel.split('(已禁用)')[0]
        }
      })
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
          const { sizes } = this.form
          data = {
            'sizeOptions': this.sizeOptions || [],
            'formSizes': sizes || [],
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
                  // todo 此处应该补充注释 @小雪
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
        return this.stashTableInfo(result)
      }
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
          this.$set(this.showSaleLabel, `${status}Usable`, true) // todo 为了确保不会进入死循环 之后可考虑改进,比如建立一个中介值（表示已移除此销售属性）
          this[`${status}Options`] = []
          // 重新触发排列组合
          this.form[`${status}s`] = []
          // 删除表头信息
          const delIndex = this.tableHeadData.findIndex(head => head.name === status)
          this.tableHeadData.splice(delIndex, 1)
        }
        // 正常可用属性
        const avaliableAttribute = this.showSaleLabel[status] && isUsable && !isDeleted
        // 已禁用或已删除但是有选中的值
        const disableButHasValue = (!isUsable || isDeleted) && hasAttr > 0
        show = avaliableAttribute || disableButHasValue
      }
      return show
    },
    disabledSaleAttr (type) {
      // 已经删除的属性可以删除，已经禁用的不可以修改
      const usable = this.showSaleLabel[`${type}Usable`]
      const deletedAttr = this.showSaleLabel[`${type}deleted`]
      if (Object.keys(this.showSaleLabel).includes(`${type}deleted`) && deletedAttr) {
        return !deletedAttr
      } else {
        if (Object.keys(this.showSaleLabel).includes(`${type}Usable`)) {
          return !usable
        }
      }
    },
    result () {
      return new Promise(resolve => {
        resolve({ 'productSalesAttributes': this.form.productSalesAttributes || [] })
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
