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
          <template v-if="showSaleLabel['color']">
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
          </template>
          <template v-if="showSaleLabel['size']">
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
                @click="openDialog(!showSaleLabel[`sizeUsable`],showSaleLabel)"
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
          </template>
          <template v-if="showSaleLabel['specification']">
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
          </template>
          <SkuTable
            :tableLabel="tableLabel"
            :showSaleLabel="showSaleLabel"
            :form="form"
            :tableHeadData="tableHeadData"
            @change="change"
          ></SkuTable>
        </el-form>
      </div>
      <!-- 尺码弹框 -->
      <ProductSizeDialog ref="ProductSizeDialog" @confirm="sizeSelectConfirm" />
    </el-card>
  </div>
</template>

<script>
import ProductSizeDialog from '../ProductSizeDialog'
import { deepClone, isEmpty } from '@shared/util'
import { mapGetters } from 'vuex'
import SkuTable from './SkuTable'
export default {
  components: { ProductSizeDialog, SkuTable },
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
      categoryDataStatus: false,
      tableLabel: {}, // 表头展示的销售属性name
      tableHeadData: [],
      defalutHeadData: [ // 表头字段
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
          maxlength: 8
        }
      ],
      skuStatus: {
        0: '待审核',
        1: '认领失败',
        2: '已发布'
      },
      numberRule: {
        'supplyPrice': { maxlength: 8 },
        'weight': { maxlength: 8, decimalsPlace: 0 }
      }
    }
  },
  computed: {
    ...mapGetters('product', [
      'productParams',
      'categoryData',
      'productSalesAttributeDetail',
      'saleAttrs',
      'comparisonSaleAttrs'
    ]),
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
    'productAttrFill': {
      handler (newValue) {
        this.initAttrData()
        const [curSaleAttrs, productSalesAttributeDetail] = deepClone(newValue)
        if (!isEmpty(productSalesAttributeDetail) && !isEmpty(curSaleAttrs)) {
          const saleTypes = {
            'NZ011': ['size', 'sizes'],
            'NZ010': ['color', 'colors'],
            'NZ012': ['specification', 'specifications']
          }
          const { productSalesAttributes, productCategorySalesAttributeSelectedList } = productSalesAttributeDetail
          this.form.productSalesAttributes = productSalesAttributes.map(sale => {
            sale.statusName = this.skuStatus[sale.status]
            return sale
          })
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
      let tableStatus = {
        name: 'statusName',
        label: '状态',
        input: true,
        required: false
      }
      this.tableHeadData = this.productParams.mode !== 'create' ? [...tableSort, ...this.defalutHeadData, tableStatus] : [...tableSort, ...this.defalutHeadData]
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
    openDialog (usable, showSaleLabel) {
      let dialog = null
      dialog = this.$refs.ProductSizeDialog
      const { sizes, specifications } = this.form
      let data = {
        'sizeOptions': this.sizeOptions || [],
        'formSizes': sizes || [],
        'specifications': specifications || [],
        'usable': usable,
        'showSaleLabel': showSaleLabel
      }
      dialog.open(data)
      dialog = null
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
    change (val) {
      this.form.productSalesAttributes = val
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
