<template>
  <div>
    <el-form ref="form" :rules="rules" model="form">
      <div class="ProductSale-table">
        <el-table :data="form.productSalesAttributes" row-key="key" border>
          <el-table-column
            v-for="(item,index) in selectAttrList"
            :key="`${item.label}${index}`"
            :width="item.width"
            align="center"
          >
            <template slot="header">
              <span class="ProductSale-from__icon" v-if="['supplyPrice','weight'].includes(item)">*</span>
              <span>{{item}}</span>
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
                    v-for="(attrItem, attrIndex) in sortedAttributes(item.attributes, true)"
                    :key="attrIndex"
                  >
                    <span>{{curAttributeName(attrItem.attributeTermId)}}</span>
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
            @click="openDialog('batchAttributes',this.form)"
            v-if="productParams.mode!== 'view'"
          >批量录入</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    selectAttrIdList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      form: { productSalesAttributes: [] },
      rules: {},
      numberRule: {
        'supplyPrice': { type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 99999999, compareLength: true, includeZero: true }
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail', 'saleAttrsMap']),
    saleAttrsMap () {
      return this.saleAttrsMap
    }
  },
  created () {

  },
  mounted () {
    console.log('21121', this.saleAttrsMap)
  },
  methods: {
    // 当前属性名
    curAttributeName (id) {
      return id
        ? this.disabledAttrValIds.includes(id)
          ? `${this.saleAttrsMap.get(id)}(已禁用)`
          : this.saleAttrsMap.has(id)
            ? this.saleAttrsMap.get(id)
            : `${this.extraAttrMap.get(id)}(已删除)`
        : ''
    },
    // 已经选中的属性list
    selectAttrList () {
      return this.sortedAttributes(this.selectAttrIdList).map(
        attribute => {
          const attributeId = attribute.attributeIds.join('-')
          const saleAttributeType = attribute.saleAttributeType
          let name = '颜色'
          switch (saleAttributeType) {
            case 1:
              name = '颜色'
              break
            case 2:
              name = '尺码'
              break
            case 3:
              name = '规格'
              break
          }
          return {
            attributeId: attributeId,
            saleAttributeType,
            name
          }
        }
      )
    },
    // sku列表属性排序
    sortedAttributes (data = [], isObject = false) {
      const curData = [...data]
      return curData.sort((a, b) => {
        const prevKey = isObject ? a.attributeId : a.attributeIds[0]
        const suffixKey = isObject ? b.attributeId : a.attributeIds[0]
        const prev = this.curSaleAttrsMap.get(prevKey) || {}
        const suffix = this.curSaleAttrsMap.get(suffixKey) || {}
        const setType = type => {
          if (type === 3) {
            type = 0
          }
          return type
        }
        return (
          setType(prev.saleAttributeType || 1) -
          setType(suffix.saleAttributeType || 1)
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
