<template>
  <div class="ProductSale" v-if="!noSaleAttributes">
    <el-card>
      <div slot="header" class="title">
        <span>销售属性</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" label-width="12rem" class="ProductSale-form">
          <el-form-item
            :label="showSaleLabel.size"
            v-if="showSaleCondition('size')"
            prop="sizes"
            :rules="[{required: true, message: '请添加尺码', trigger:'blur' }]"
          >
            <span
              class="ProductSale-sizes"
              v-if="productParams.mode!=='view'"
              @click="openDialog('size')"
            >添加尺码</span>
            <el-tag
              style="margin: 0 0 .5rem 1rem"
              v-for="(tag, index) in form.sizes"
              :key="tag.id"
              closable
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
          <el-form-item
            :label="showSaleLabel['specification']"
            prop="specifications"
            v-if="showSaleCondition('specification')"
            :rules="[{required: true, message: '请选择', trigger:'change' }]"
          >
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
              placeholder="请选择规格"
              @change="selectChange($event, 'specifications')"
            />
          </el-form-item>
          <div class="ProductSale-table">
            <el-table :data="form.productSalesAttributes" row-key="key" border>
              <el-table-column
                v-for="item in tableHeadData"
                :key="item.label"
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
                    :rules="[{required: item.required, message: `${item.message}`, trigger:['blur','change' ]}]"
                    class="flex-center"
                  >
                    <template v-if="item.extendCode">
                      <!-- 动态销售属性(尺码/规格/颜色) -->
                      <div
                        v-for="(tableAttr,index) in scope.row.productCategorySalesAttributes"
                        :key="index"
                      >
                        <span
                          v-if="tableLabel[tableAttr.attributeTermId+''].extendCode === item.extendCode"
                        >{{tableLabel[tableAttr.attributeTermId+''].name}}</span>
                      </div>
                    </template>
                    <!-- 供货价格/sku/吊牌/带包装 -->
                    <el-input
                      v-else
                      v-model="scope.row[item.name]"
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
import RecommendApi from '@api/recommendProducts/recommendProducts'
import ProductSizeDialog from './ProductSizeDialog'
import BatchAttributes from './batchAttributes'
import { isEmpty } from '@shared/util'
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
      catagoryData: [],
      stashTableData: new Map(), // 临时缓存表格数据
      showSaleLabel: {}, // 销售属性动态展示的label
      tableLabel: [], // 表头展示的销售属性name
      tableHeadData: [ // 表头字段
        {
          name: 'supplyPrice',
          label: '供货价格（RMB）',
          required: true,
          message: '请输入供货价格'
        },
        {
          name: 'skuCode',
          label: '商家SKU编码'
        },
        {
          name: 'tagSize',
          label: '商家吊牌尺码'
        },
        {
          name: 'weight',
          label: '带包装重量（G）',
          required: true,
          message: '请输入带包装重量'
        }
      ],
      numberRule: {
        'supplyPrice': { type: 'gold', max: 999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 999999, compareLength: true, includeZero: true }
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'noSaleAttributes', 'productSalesAttributeDetail']),
    changeForm () {
      const { sizes, colors, specifications } = this.form
      return [
        sizes || [],
        colors || [],
        specifications || []
      ]
    },
    showTable () {
      // 多个属性，需要都选择值以后数据插入表格中
      const { sizes, colors, specifications } = this.form
      const len = []
      const showAttrs = {
        'size': sizes.length,
        'color': colors.length,
        'specification': specifications.length
      }
      Object.keys(this.showSaleLabel).forEach(item => {
        if (['size', 'color', 'specification'].includes(item)) len.push(showAttrs[item])
      })
      return len.every(item => item > 0)
    }
  },
  watch: {
    'changeForm': {
      // 监听尺码/颜色/规格变化
      handler (newValue) {
        // 多个属性都选择了数据数据添加到table中，否则就重置table
        switch (this.showTable) {
          case true:
            this.form.productSalesAttributes = this.addTableItems(newValue)
            break
          case false:
            this.form.productSalesAttributes = []
            break
        }
      },
      immediate: true,
      deep: true
    },
    'productSalesAttributeDetail': {
      handler (newValue) {
        if (newValue) {
          const saleTypes = {
            'NZ011': ['size', 'sizes'],
            'NZ010': ['color', 'colors'],
            'NZ012': ['specification', 'specifications']
          }
          const { productCategorySalesAttributeSelectedList, productSalesAttributes } = newValue
          this.form.productSalesAttributes = productSalesAttributes
          const saleAttrs = this.catagoryData.filter(sale => ['NZ010', 'NZ011', 'NZ012'].includes(sale.extendCode))
          const deletedSaleAttr = productCategorySalesAttributeSelectedList.filter(productSaleAttr => !saleAttrs.find(attr => attr.extendCode === productSaleAttr.attribute.extendCode)) || []
          if (!isEmpty(deletedSaleAttr)) {
            // 有删除的销售属性
            deletedSaleAttr.forEach(delSale => {
              const deletedExtendCode = delSale.attribute.extendCode
              this.showSaleLabel[saleTypes[deletedExtendCode][0]] = `${delSale.attribute.name}(已删除)`
              this.showSaleLabel[`${saleTypes[deletedExtendCode][0]}deleted`] = true
              const attributeTerms = delSale.attributeTerms
              const options = attributeTerms.map(attr => {
                attr.name = `${attr.name}(已删除)`
                return {
                  ...attr,
                  attributeId: delSale.attributeId,
                  extendCode: delSale.attribute.extendCode
                }
              })
              // 删除属性回填数据
              this.form[`${saleTypes[deletedExtendCode][1]}`] = attributeTerms
              // 删除属性下拉框数据
              this[`${saleTypes[deletedExtendCode][0]}Options`] = options
              this.tableHeadData.unshift({ name: saleTypes[deletedExtendCode][0], label: delSale.attribute.name, extendCode: deletedExtendCode })
            })
          }
          // 没有删除属性进行属性值回填
          productCategorySalesAttributeSelectedList.forEach(saleAttr => {
            const { attributeId, attribute, attributeTerms } = saleAttr
            const classified = saleTypes[attribute.extendCode][1]
            const typeOption = saleTypes[attribute.extendCode][0]
            const deletedItems = []
            const optionIds = this[`${typeOption}Options`].reduce((init, option) => init.concat(option.id), [])
            this.form[classified] = attributeTerms.map(attr => {
              // 属性值被删除
              if (!optionIds.includes(attr.id)) {
                attr.name = `${attr.name}(已删除)`
                deletedItems.push({ ...attr, name: attr.name, extendCode: attribute.extendCode })
              }
              return {
                ...attr,
                attributeId: attributeId,
                extendCode: attribute.extendCode
              }
            })
            // 重新修改尺码表数据
            if (classified === 'sizes') this.$store.commit('product/CHECKED_SIZES', this.form[classified])
            // 下拉框添加删除的属性值
            this[`${typeOption}Options`].push(...deletedItems)
          })
        }
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      RecommendApi.plmCategoryAttrs(this.productParams.categoryId, { system: 2 })
        .then(res => {
          const data = res.data
          this.catagoryData = data
          // form 颜色/尺寸/规格动态展示的lable
          const showSaleLabel = {}
          const buildSaleData = (showSaleLabel, item, type) => {
            this[`${type}Options`] = this.addExtendCode(item.terms, item.extendCode, item.id)
            this.tableHeadData.unshift({ name: type, label: item.name, extendCode: item.extendCode })
            showSaleLabel[type] = item.name
          }
          data.forEach(item => {
            switch (item.extendCode) {
              // 规格
              case 'NZ012':
                buildSaleData(showSaleLabel, item, 'specification')
                break
              // 颜色
              case 'NZ010':
                buildSaleData(showSaleLabel, item, 'color')
                break
              // 尺码
              case 'NZ011':
                buildSaleData(showSaleLabel, item, 'size')
                this.$store.commit('product/SIZE_ATTR', { name: item.name, attributeId: item.id, terms: item.terms })
                break
              // 尺码标准
              case 'NZ013':
                this.$store.commit('product/SIZE_STANDARD', { terms: item.terms })
                break
              default:
                // 商品属性（其他属性）
                const customAttributesData = data.filter(item => item.type.value === 4)
                this.$store.commit('product/CUSTOM_ATTRIBUTES_DATA', customAttributesData)
            }
          })

          // 判断是否有销售属性
          const noSaleAttributes = data.filter(attr => ['NZ012', 'NZ010', 'NZ011'].includes(attr.extendCode))
          this.$store.commit('product/NO_SALE_ATTRIBUTES', noSaleAttributes.length)
          this.showSaleLabel = showSaleLabel
        })
    },
    addExtendCode (saleAttrItem, extendCode, attributeId) {
      // 尺寸/尺码/规格添加标识
      return saleAttrItem.map(item => {
        item.extendCode = extendCode
        item.attributeId = attributeId
        return item
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
    openDialog (type, data = []) {
      let dialog = null
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
            'formSizes': sizes || []
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
      const hasNoneAttr = attrArr.flat().length !== 0
      const hasAttrLen = attrArr.filter(item => item.length > 0)
      if (hasNoneAttr) {
        attrArr.forEach((saleAttrItemItem) => {
          if (saleAttrItemItem && saleAttrItemItem.length === 0) return
          if (resultArry.length === 0) {
            if (hasAttrLen > 1) {
              resultArry = saleAttrItemItem
            } else {
              // 销售属性只有其中一个属性情况
              saleAttrItemItem.forEach(item => {
                this.$set(tableLabel, item.id, item)
                resultArry.push([{ attributeTermId: item.id, attributeId: item.attributeId }])
              })
            }
          } else {
            const emptyArray = []
            resultArry.forEach((item) => {
              saleAttrItemItem.forEach((value) => {
                if (Array.isArray(item)) {
                  this.$set(tableLabel, value.id, value)
                  emptyArray.push([...item, { attributeTermId: value.id, attributeId: value.attributeId }])
                } else {
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
        const showDatas = JSON.parse(JSON.stringify(saleData))
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
      const checkedSales = this[`${status}Options`] ? this[`${status}Options`].length : 0
      const hasDeleted = this.showSaleLabel[`${status}deleted`]
      const hasAttr = this.form[`${status}s`] ? this.form[`${status}s`].length : 0
      if (!hasDeleted) {
        // 没有删除属性，判断当前属性是否有属性，没有隐藏
        return checkedSales > 0
      } else {
        // 有删除属性，如果属性值为空隐藏
        if (hasAttr > 0) {
          return true
        } else {
          delete this.showSaleLabel[status]
          delete this.showSaleLabel[`${status}deleted`]
          this[`${status}Options`] = []
          // 重新触发排列组合
          this.form[`${status}s`] = []
          // 删除表头信息
          const delIndex = this.tableHeadData.findIndex(head => head.name === status)
          this.tableHeadData.splice(delIndex, 1)
          return false
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
