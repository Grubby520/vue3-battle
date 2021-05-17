<template>
  <div class="sku-table">
    <el-form ref="form" :rules="rules">
      <table v-if="tableData.length > 0">
        <thead>
          <tr>
            <th v-for="item in selectAttrList" :key="item.attributeId">{{item.name}}</th>
            <th>销售状态</th>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'tableData',
    event: 'change'
  },
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
        attrsMap.set(attribute.attributeId, attribute)
      })
      return attrsMap
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
  created () {

  },
  mounted () {
    // console.log('21121', this.saleAttrsMap)
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
      return this.saleAttrsMap.get(id)
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
}
</style>
