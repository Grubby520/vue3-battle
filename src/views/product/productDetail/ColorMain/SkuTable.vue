<template>
  <div class="sku-table">
    <el-table :data="form.productSalesAttributes" row-key="key" border class="sku-table-form">
      <el-table-column
        v-for="(item,index) in tableHeadData"
        :key="`${item.label}${index}`"
        :width="item.width"
        align="center"
      >
        <template slot="header">
          <span
            class="sku-table-icon"
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
              v-else-if="['supplyPrice','weight'].includes(item.name)"
              v-model.trim="scope.row[item.name]"
              :maxlength="item.maxlength"
              v-number="numberRule[item.name]"
            />
            <span v-else-if="item.isText">{{scope.row[item.name]}}</span>
            <el-input v-else v-model.trim="scope.row[item.name]" :maxlength="item.maxlength" />
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sku-table-batch">
      <SlSpace />
      <el-button
        type="primary"
        @click="openDialog('batchAttributes')"
        v-if="productParams.mode!== 'view'"
      >批量录入</el-button>
    </el-row>
    <!-- 批量设置弹窗 -->
    <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
  </div>
</template>

<script>
import BatchAttributes from './batchAttributes'
import { mapGetters } from 'vuex'
import { deepClone, isEmpty } from '@shared/util'
export default {
  components: { BatchAttributes },
  props: {
    form: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    tableHeadData: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    showSaleLabel: {
      type: Object,
      required: false,
      default: () => { return {} }
    }
  },
  data () {
    return {
      numberRule: {
        'supplyPrice': { maxlength: 8 },
        'weight': { maxlength: 8, decimalsPlace: 0 }
      },
      tableLabel: {},
      stashTableData: new Map() // 临时缓存表格数据
    }
  },
  computed: {
    ...mapGetters('product', [
      'productParams'
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
    }
  },
  watch: {
    'changeForm': {
      // 监听尺码/颜色/规格变化
      handler ({ saleAttrArr }) {
        // 多个属性都选择了数据数据添加到table中，否则就重置table
        this.$emit('change', this.addTableItems(saleAttrArr) || [])
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    openDialog () {
      let dialog = null
      let data = this.form
      dialog = this.$refs.batchAttributes
      dialog.open(data)
      dialog = null
    },
    /**
     * 批量录入回填
     * @param {Array} val 需要回填的数据
     */
    hideDialog (data) {
      let {
        checkedIds = {},
        supplyPrice = '',
        weight
      } = data
      const hasCheckValue = Object.values(checkedIds).flat().length > 0
      const checkedIdsInfo = {}
      Object.keys(checkedIds).forEach(id => {
        if (!isEmpty(checkedIds[id])) {
          checkedIdsInfo[id] = checkedIds[id]
        }
      })
      if (hasCheckValue && (supplyPrice || weight)) {
        this.form.productSalesAttributes.forEach((item, index) => {
          const isMatchCheck = item.productCategorySalesAttributes.every(
            attribute => {
              return !checkedIdsInfo[attribute.attributeId] ||
                checkedIdsInfo[attribute.attributeId].includes(
                  attribute.attributeTermId
                )
            }
          )
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
        return this.stashTableInfo(result)
      }
    },
    /**
  * 暂存尺码销售属性之前的记录
  */
    stashLastData () {
      if (!isEmpty(this.form.productSalesAttributes)) {
        this.form.productSalesAttributes.forEach(tableItem => {
          const salesAttributeIds = tableItem.productCategorySalesAttributes
            .reduce((init, stash) => init.concat(stash.attributeTermId), []).join('')
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
          const tableItemIds = tableItem.productCategorySalesAttributes
            .reduce((init, stash) => init.concat(stash.attributeTermId), []).join('')
          const value = this.stashTableData.get(`${tableItemIds}`)
          Object.assign(tableItem, value)
        })
        return showDatas
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sku-table {
  padding: 0 0 0 12rem;
  &-form {
    /deep/.el-form-item__content {
      margin-left: 0 !important;
    }
  }
  &-icon {
    display: inline-block;
    margin-right: 0.5rem;
    color: red;
  }
  &-batch {
    display: flex;
    margin-top: 1rem;
  }
}
</style>
