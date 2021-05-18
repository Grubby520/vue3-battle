<template>
  <div class="sku-table">
    <el-form ref="form" :rules="rules">
      <table v-if="tableData.length > 0">
        <thead>
          <tr>
            <th v-for="item in selectAttrList" :key="item.attributeId">{{item.name}}</th>
            <th>供货价格（RMB）</th>
            <th>商家SKU编码</th>
            <th>商家吊牌尺码</th>
            <th>带包装重量（G）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td
              v-for="(attrItem, attrIndex) in sortedAttributes(item.attributes, true)"
              :key="attrIndex"
            >
              <span>{{curAttributeName(attrItem.attributeTermId)}}</span>
            </td>
            <td>
              <el-input v-model="item.supplyPrice" clearable v-number="{ maxlength: 8 }"></el-input>
            </td>
            <td>
              <el-input v-model="item.skuCode" clearable v-number="{ maxlength: 30 }"></el-input>
            </td>
            <td>
              <el-input v-model="item.tagSize" clearable v-number="{ maxlength: 30 }"></el-input>
            </td>
            <td>
              <el-input v-model="item.weight" clearable v-number="{ maxlength: 8 }"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <el-row class="sku-table__batch">
      <SlSpace />
      <el-button
        type="primary"
        @click="openDialog('batchAttributes')"
        v-if="productParams.mode!== 'view'"
      >批量录入</el-button>
    </el-row>
    <!-- 批量设置弹窗 -->
    <BatchAttributes @hide="hideDialog" ref="batchAttributes" @batchInput="handleBatchInput" />
  </div>
</template>

<script>
import BatchAttributes from './batchAttributes'
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'tableData',
    event: 'change'
  },
  components: { BatchAttributes },
  props: {
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectAttrIdList: {
      type: Array,
      default: function () {
        return []
      }
    },
    curSaleAttrs: {
      type: Array,
      default: function () {
        return []
      }
    },
    attributeMap: {
      type: Map,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      form: {},
      rules: {}
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail', 'saleAttrsMap']),
    curSaleAttrsMap () {
      const attrsMap = new Map()
      this.curSaleAttrs.forEach(attribute => {
        attrsMap.set(attribute.id, attribute)
      })
      return attrsMap
    },
    // 排序弹窗需要的数据结构
    curFormItem () {
      // console.log(
      //   'attributeMapToObj',
      //   this.attributeMapToObj(this.attributeMap || new Map())
      // )
      // console.log('21212121212', this.attributeMap)
      return this.attributeMapToObj(this.attributeMap || new Map())
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
    }
  },
  methods: {
    // 当前属性名
    curAttributeName (id) {
      // return id
      //   ? this.disabledAttrValIds.includes(id)
      //     ? `${this.saleAttrsMap.get(id)}(已禁用)`
      //     : this.saleAttrsMap.has(id)
      //       ? this.saleAttrsMap.get(id)
      //       : `${this.extraAttrMap.get(id)}(已删除)`
      //   : ''
      // console.log('id', id)
      return this.saleAttrsMap.get(id)
    },
    // sku列表属性排序
    sortedAttributes (data = [], isObject = false) {
      const curData = [...data]
      const sss = curData.sort((a, b) => {
        const prevKey = isObject ? a.attributeId : a.attributeIds[0]
        const suffixKey = isObject ? b.attributeId : b.attributeIds[0]
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
      return sss
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
    openDialog (data = {}) {
      const current = {
        curFormItem: this.curFormItem,
        selectAttrList: this.selectAttrList,
        tableData: this.tableData
      }
      // console.log('current', current, this.tableData)
      let dialog = null
      dialog = this.$refs.batchAttributes
      dialog.open(current)
      dialog = null
    },
    attributeMapToObj (map) {
      var attributeObject = {}
      this.selectAttrIdList.forEach(attribute => {
        const attributeIds = attribute.attributeIds
        const attributeTermIds = [
          ...new Set(
            attributeIds
              .map(attributeId => map.get(attributeId))
              .flat()
          )
        ]
        attributeObject[attributeIds.join('-')] = attributeTermIds.map(
          attributeTermId => {
            return {
              attributeId: attributeIds.join('-'),
              attributeTermId,
              name: this.curAttributeName(attributeTermId)
            }
          }
        )
      })
      console.log('1111111111111', attributeObject)
      return attributeObject
    },
    handleBatchInput () { }
    // 批量录入
    // handleBatchInput (data) {
    //   const {
    //     checkedIds = {},
    //     supplyPrice = '',
    //     sellPriceUsd = '',
    //     weight
    //   } = data
    //   const curLength = Object.values(checkedIds).flat().length
    //   if (!curLength || (!supplyPrice && !sellPriceUsd && !weight)) {
    //     return
    //   } else {
    //     this.tableData.forEach((item, index) => {
    //       if (
    //         item.attributes.every(
    //           zItem =>
    //             !checkedIds[zItem.attributeId] ||
    //             checkedIds[zItem.attributeId].includes(
    //               zItem.attributeTermId
    //             )
    //         )
    //       ) {
    //         supplyPrice &&
    //           this.$set(
    //             this.tableData[index],
    //             'supplyPrice',
    //             supplyPrice
    //           )
    //         sellPriceUsd &&
    //           this.$set(
    //             this.tableData[index],
    //             'sellPriceUsd',
    //             this.handleSellPrice(sellPriceUsd)
    //           )
    //         weight &&
    //           this.$set(
    //             this.tableData[index],
    //             'packageWeight',
    //             weight
    //           )
    //         // 批量录入了采购价、预估重量并且销售价数据为空自动计算
    //         if (
    //           this.tableData[index].supplyPrice &&
    //           this.tableData[index].packageWeight &&
    //           !this.tableData[index].sellPriceUsd
    //         ) {
    //           const res = computeSellPrice(
    //             this.tableData[index].supplyPrice,
    //             this.tableData[index].packageWeight
    //           )
    //           this.$set(
    //             this.tableData[index],
    //             'sellPriceUsd',
    //             res
    //           )
    //         }
    //       }
    //     })
    //   }
    // },
  }
}
</script>

<style scoped lang="scss">
.sku-table {
  $borderStyle: 1px solid #ebeef5;
  overflow-x: auto;
  table {
    margin-top: 10px;
    max-width: 100%;
    thead {
      th {
        font-weight: normal;
        text-align: center;
        padding: 8px 15px;
        border: $borderStyle;
        color: #303133;
        span {
          float: right;
        }
      }
    }
    tr {
      td {
        padding: 8px 15px;
        min-width: 120px;
        border: $borderStyle;
        text-align: center;
        /deep/ .el-input {
          float: left;
          width: auto;
          margin: 3px;

          input {
            width: 100px;
            &::-webkit-input-placeholder {
              text-align: center;
            }
          }
        }

        .has-offline {
          color: #f56c6c;
        }

        .has-clearance {
          color: #e6a23c;
        }

        .flex-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
        }
      }
    }
  }

  .required:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    vertical-align: middle;
  }
  &__batch {
    display: flex;
    margin-top: 1rem;
  }
}
</style>
