<template>
  <div class="sku-table">
    <el-form ref="form" :rules="rules">
      <table v-if="tableData.length > 0" style="width:100%">
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
    <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
  </div>
</template>

<script>
import BatchAttributes from '../../batchAttributes'
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
      const attributeColorAndSize = this.attributeColorAndSize(this.attributeMap || new Map())
      const [cololrs, specificationAttrs] = attributeColorAndSize
      const colorKeys = {}
      const colorAttrs = (cololrs || [])
        .map(color => color.attributeTermId)
        .reduce((init, color) => {
          if (!colorKeys[color.id]) {
            init.push(color)
            colorKeys[color.id] = true
          }
          return init
        }, [])
      return { colorAttrs, specificationAttrs }
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
      console.log('val', val)
      const { skuList, supplyPrice, sizeList } = val
      // 颜色和供货价格
      let hasNeedSku = skuList.length > 0 && supplyPrice
      let sizeMap = new Map()
      sizeList.forEach((size) => {
        // 尺码和重量
        if (size.weight) sizeMap.set(size.attributeTermId, size.weight)
      })
      this.tableData.forEach(item => {
        let saleAttrIds = []
        item.attributes.forEach((attribute) => {
          saleAttrIds.push(attribute.attributeTermId)
        })
        const includeBatchColor = saleAttrIds.find(i => skuList.includes(i))
        const includeBatchSize = saleAttrIds.find(i => sizeMap.get(i))
        if (hasNeedSku && includeBatchColor) this.$set(item, 'supplyPrice', supplyPrice)
        if (includeBatchSize) this.$set(item, 'weight', sizeMap.get(includeBatchSize))
      })
    },
    openDialog (data = {}) {
      let dialog = null
      dialog = this.$refs.batchAttributes
      dialog.open(this.curFormItem)
      dialog = null
    },
    attributeColorAndSize (map) {
      // 批量录入需要的数据
      var attributeAttrs = []
      this.selectAttrIdList.forEach(attribute => {
        const attributeIds = attribute.attributeIds
        const saleAttributeType = attribute.saleAttributeType
        if (saleAttributeType !== 2) {
          const attributeTermIds = [
            ...new Set(
              attributeIds
                .map(attributeId => map.get(attributeId))
                .flat()
            )
          ]
          const attributeTerm = attributeTermIds.map(
            attributeTermId => {
              return {
                attributeId: attributeIds.join('-'),
                attributeTermId,
                name: this.curAttributeName(attributeTermId)
              }
            }
          )
          attributeAttrs.push(attributeTerm)
        }
      })
      return attributeAttrs
    }
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
