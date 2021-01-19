<template>
  <div class="ProductSale">
    <el-card>
      <div slot="header" class="title">
        <span>销售属性</span>
      </div>
      <div class="form">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="120px"
          class="ProductSale-form"
        >
          <el-form-item :label="showSaleLabel['size']" prop="sizes">
            <span class="ProductSale-sizes" @click="openDialog('size')">添加尺码</span>
            <el-tag
              style="margin: 0 0 5px 10px"
              v-for="(tag, index) in form.sizes"
              :key="tag.id"
              closable
              effect="dark"
              :type="['success', 'info', 'danger', 'warning', ''][index%5]"
              @close="removeSizeTag(tag)"
            >{{tag.name}}</el-tag>
          </el-form-item>
          <el-form-item
            :label="showSaleLabel['color']"
            prop="colors"
            v-if="colorOptions && colorOptions.length>0"
          >
            <SlSelect
              :options="colorOptions"
              ref="colorSelect"
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
            v-if="specificationOptions && specificationOptions.length>0"
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
            <el-table :data="form.productCategorySalesAttributes" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
                :width="item.width"
                align="center"
              >
                <template slot="header">
                  <span
                    class="ProductSale-from__icon"
                    v-if="['supplyPrice','supplierSkuCode'].includes(item.name)"
                  >*</span>
                  <span>{{item.label}}</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    :prop="`productCategorySalesAttributes.${scope.$index}.${item.name}`"
                    :rules="rules[item.name]"
                    class="ProductSale-from__content"
                  >
                    <template v-if="item.extendCode">
                      <!-- <div v-for="(tableAttr,index) in scope.row" :key="index">
                        <span
                          v-if="tableLabel[tableAttr.attributeTermId+''].extendCode === item.extendCode"
                        >{{tableLabel[tableAttr.attributeTermId+''].name}}</span>
                      </div>-->
                    </template>
                    <el-input
                      v-else
                      v-model="scope.row[item.name]"
                      v-slFormatNumber="['supplyPrice','weight'].includes(item.name) ?numberRule[item.name] :''"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="ProductSale-from__batch">
              <SlSpace />
              <el-button type="primary" @click="openDialog('batchAttributes')">批量录入</el-button>
            </el-row>
          </div>
        </el-form>
      </div>
      <!-- 尺码弹框 -->
      <ProductSizeDialog
        ref="ProductSizeDialog"
        :sizeOptions="sizeOptions"
        @confirm="sizeSelectConfirm"
      />
      <!-- 批量设置弹窗 -->
      <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
    </el-card>
  </div>
</template>

<script>
// import RecommendApi from '@api/recommendProducts/recommendProducts'
import ProductSizeDialog from './ProductSizeDialog'
import BatchAttributes from './batchAttributes'
import { emptyValidator } from '@shared/validate'
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  components: { ProductSizeDialog, BatchAttributes },
  data () {
    return {
      form: {
        productCategorySalesAttributes: [],
        sizes: [],
        colors: [],
        specifications: []
      },
      colorOptions: [],
      sizeOptions: [],
      specificationOptions: [],
      showSaleLabel: {},
      tableLabel: [],
      rules: {
        sizes: [emptyValidator('请选择尺寸', 'change')],
        colors: [emptyValidator('请选择颜色', 'change')],
        specifications: [emptyValidator('请选择规格', 'change')],
        supplyPrice: [emptyValidator('请输入供货价格')],
        supplierSkuCode: [emptyValidator('请输入商家SKU编码')]
      },
      tableHeadData: [ // 表头字段
        {
          name: 'supplyPrice',
          label: '供货价格（RMB）'
        },
        {
          name: 'supplierSkuCode',
          label: '商家SKU编码'
        },
        {
          name: 'tagSize',
          label: '商家吊牌尺码'
        },
        {
          name: 'weight',
          label: '带包装重量（G）'
        }
      ],
      numberRule: {
        'supplyPrice': { type: 'gold', max: 999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 999999, compareLength: true, includeZero: true }
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'productBasicInfo']),
    changeForm () {
      const { sizes, colors, specifications } = this.form
      return [
        sizes || [],
        colors || [],
        specifications || []
      ]
    }
  },
  watch: {
    'changeForm': {
      // 监听尺码/颜色/规格变化
      handler (newValue, oldValue) {
        this.form.productCategorySalesAttributes = this.getCombination(newValue)
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      axios.get('http://10.250.0.66:7300/mock/5fe990dd2fe14f098b103ef2/srm/plm-category/attribute-and-term')
        .then(res => {
          const data = res.data.data
          // form 颜色/尺寸/规格动态展示的lable
          const showSaleLabel = {}
          data.forEach(item => {
            switch (item.extendCode) {
              case 'NZ012':
                this.specificationOptions = this.addExtendCode(item.terms, item.extendCode)
                this.tableHeadData.unshift({ name: 'specification', label: item.name, extendCode: item.extendCode })
                showSaleLabel['specification'] = item.name
                break
              case 'NZ010':
                this.colorOptions = this.addExtendCode(item.terms, item.extendCode)
                this.tableHeadData.unshift({ name: 'color', label: item.name, extendCode: item.extendCode })
                showSaleLabel['color'] = item.name
                break
              case 'NZ011':
                this.sizeOptions = this.addExtendCode(item.terms, item.extendCode)
                this.tableHeadData.unshift({ name: 'size', label: item.name, extendCode: item.extendCode })
                showSaleLabel['size'] = item.name
                this.$store.commit('product/SIZEATTR', { name: item.name, attributeTermId: item.id, attributeId: 11111 })
                break
            }
          })
          this.showSaleLabel = showSaleLabel
        })
    },
    addExtendCode (arr, extendCode) {
      // 尺寸/尺码/规格添加标识
      return arr.map(item => {
        item.extendCode = extendCode
        return item
      })
    },
    selectChange (e, attribute) {
      this.$refs.form.validateField(attribute) // 重新校验表单
    },
    removeSizeTag (tag) {
      this.form.sizes = this.form.sizes.filter(item => item.id !== tag.id)
      this.$refs.form.validateField('sizes')
      this.$store.commit('product/SIZEOPTIONS', this.form.sizes)
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      this.$store.commit('product/SIZEOPTIONS', val)
      this.$refs.form.validateField('sizes')
    },
    openDialog (type, data = '') {
      let dialog = null
      switch (type) {
        case 'batchAttributes':
          dialog = this.$refs.batchAttributes
          // data = this.productSalesAttributeList
          break
        case 'size':
          dialog = this.$refs.ProductSizeDialog
      }
      dialog.open(type, data)
      dialog = null
    },
    getCombination (array) {
      let resultArry = []
      const tableLabel = {}
      array.forEach((arrItem) => {
        if (arrItem && arrItem.length === 0) return
        if (resultArry.length === 0) {
          resultArry = arrItem
        } else {
          const emptyArray = []
          resultArry.forEach((item) => {
            arrItem.forEach((value) => {
              if (Array.isArray(item)) {
                tableLabel[value.id] = { name: value.name, extendCode: value.extendCode, id: value.id }
                emptyArray.push([...item, { attributeTermId: value.id, attributeId: 1111 }])
              } else {
                tableLabel[item.id] = { name: item.name, extendCode: item.extendCode, id: item.id }
                tableLabel[value.id] = { name: value.name, extendCode: value.extendCode, id: value.id }
                emptyArray.push([{ attributeTermId: item.id, attributeId: 1111 }, { attributeTermId: value.id, attributeId: 1111 }])
              }
            })
          })
          resultArry = emptyArray
        }
      })
      this.tableLabel = tableLabel
      return resultArry
    },
    hideDialog () {

    },
    result () {
      return new Promise(resolve => {
        resolve({ 'productCategorySalesAttributes': [] })
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
    &__content {
      display: flex;
      justify-content: center;
      align-items: center;
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
}
</style>
