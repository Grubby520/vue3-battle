<template>
  <div class="sku-table">
    <el-form ref="form" :rules="rules">
      <table v-if="tableData.length > 0" style="width:100%;">
        <thead>
          <tr>
            <th v-for="item in selectAttrList" :key="item.attributeId">{{item.name}}</th>
            <th class="required">供货价格（RMB）</th>
            <th>商家SKU编码</th>
            <th class="required">商家吊牌尺码</th>
            <th class="required">带包装重量（G）</th>
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
      <el-button type="primary" @click="openDialog('batchAttributes')" v-if="showBatchBtn">批量录入</el-button>
    </el-row>
    <!-- 批量设置弹窗 -->
    <BatchTypingDialog
      :visible.sync="batchTypingVisible"
      :cur-form-item="curFormItem"
      :select-attr-list="selectAttrList"
      @batchInput="handleBatchInput"
    ></BatchTypingDialog>
  </div>
</template>

<script>
import BatchTypingDialog from '../../batchTypingDialog.vue'
import { mapGetters } from 'vuex'
import { deepClone, isEmpty } from '@shared/util'
export default {
  model: {
    prop: 'tableData',
    event: 'change'
  },
  components: { BatchTypingDialog },
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
      rules: {},
      batchTypingVisible: false // 批量输入弹窗是否可见
    }
  },
  computed: {
    ...mapGetters('product', [
      'productParams',
      'categoryData',
      'productSalesAttributeDetail',
      'saleAttrsMap'
    ]),
    curSaleAttrsMap () {
      const attrsMap = new Map()
      this.curSaleAttrs.forEach(attribute => {
        attrsMap.set(attribute.id, attribute)
      })
      return attrsMap
    },
    // 批量录入需要的数据结构
    curFormItem () {
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
    },
    showBatchBtn () {
      return this.tableData.length > 0 && this.productParams.mode !== 'view'
    }
  },
  methods: {
    // 当前属性名
    curAttributeName (id) {
      return this.saleAttrsMap.get(id)
    },
    // sku列表属性排序
    sortedAttributes (data = [], isObject = false) {
      const curData = [...data]
      return curData.sort((a, b) => {
        const prevKey = isObject ? a.attributeId : a.attributeIds[0]
        const suffixKey = isObject ? b.attributeId : b.attributeIds[0]
        const prev = this.curSaleAttrsMap.get(prevKey) || {}
        const suffix = this.curSaleAttrsMap.get(suffixKey) || {}
        const preSaleAttributeType = prev.saleAttributeType && prev.saleAttributeType.value
        const suffixSaleAttributeType = suffix.saleAttributeType && suffix.saleAttributeType.value
        const setType = type => {
          if (type === 3) {
            type = 0
          }
          return type
        }
        return (
          setType(preSaleAttributeType || 1) -
          setType(suffixSaleAttributeType || 1)
        )
      })
    },
    /**
     * 批量录入回填
     * @param {Array} val 需要回填的数据
     */
    handleBatchInput (data) {
      let {
        checkedIds = {}, // 选中的销售属性Id集合
        supplyPrice = '', // 供货价=
        weight // 带包装重量
      } = data
      const hasCheckValue = Object.values(checkedIds).flat().length > 0
      checkedIds = this.transComplexAttributeObject(checkedIds)
      // 如果有选中销售属性值 且 采购价、销售价、预估重量中有录入的
      if (hasCheckValue && (supplyPrice || weight)) {
        this.tableData.forEach((item, index) => {
          const isMatchCheck = item.attributes.every(
            attribute =>
              !checkedIds[attribute.attributeId] ||
              checkedIds[attribute.attributeId].includes(
                attribute.attributeTermId
              )
          )
          if (isMatchCheck) {
            supplyPrice &&
              this.$set(
                this.tableData[index],
                'supplyPrice',
                supplyPrice
              )
            weight &&
              this.$set(
                this.tableData[index],
                'weight',
                weight
              )
          }
        })
      }
    },
    /**
         * 解构复杂的尺码Id
         * eg: {5-8: [1, 2]} to {5: [1, 2], 8: [1: 2]}
         */
    transComplexAttributeObject (checkedIds) {
      const complexSizeId = Object.keys(checkedIds).find(
        attributeId => attributeId.indexOf('-') > -1
      )
      if (complexSizeId) {
        const attributeIds = complexSizeId.split('-')
        attributeIds.forEach(attributeId => {
          checkedIds[attributeId] = deepClone(
            checkedIds[complexSizeId]
          )
        })
        delete checkedIds[complexSizeId]
      }
      return checkedIds
    },
    openDialog (type) {
      switch (type) {
        case 'batchAttributes':
          this.batchTypingVisible = true
          break
      }
    },
    /**
         * 销售属性 Map 转换成 Object
         * eg [attributeId]: [{attributeId: '', attributeTermId: '', name: ''}]
         * 尺码的 [attributeId] 为 多个尺码的[attributeId] 通过 `-` 拼接来的
         */
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
        ].filter(item => !isEmpty(item))
        attributeObject[attributeIds.join('-')] = attributeTermIds.map(
          attributeTermId => {
            return {
              attributeId: attributeIds.join('-'),
              attributeTermId: attributeTermId,
              name: this.curAttributeName(attributeTermId)
            }
          }
        )
      })
      return attributeObject
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
        min-width: 150px;
        border: $borderStyle;
        text-align: center;
        /deep/ .el-input {
          float: left;
          width: auto;
          margin: 3px;

          input {
            width: 200px;
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
