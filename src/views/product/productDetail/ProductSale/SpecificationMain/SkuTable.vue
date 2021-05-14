<template>
  <div>
    <el-form ref="form" :rules="rules" model="form">
      <div class="ProductSale-table">
        <el-table :data="form.productSalesAttributes" row-key="key" border>
          <el-table-column
            v-for="(item,index) in form.saleHead"
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
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail'])
  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
</style>
