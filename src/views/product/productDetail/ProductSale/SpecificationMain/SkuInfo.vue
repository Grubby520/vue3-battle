<template>
  <div class="skuInfo">
    <el-card class="skuInfo-card">
      <div slot="header" class="title">
        <span>销售属性</span>
      </div>
      <div class="sku-info-content">
        <SaleAttribute
          :table-data="tableData"
          :cur-sale-attrs="curSaleAttrs"
          @change="handleAttribute"
          ref="saleAttribute"
          class="skuInfo-tab"
        ></SaleAttribute>
        <SkuTable
          v-model="tableData"
          :cur-sale-attrs="curSaleAttrs"
          :attribute-map="attributeMap"
          :select-attr-id-list="selectAttrIdList"
          class="pointer-enable skuInfo-table"
        ></SkuTable>
      </div>
    </el-card>
  </div>
</template>

<script>
import SkuTable from './SkuTable'
import SaleAttribute from './SaleAttribute'
import { deepClone, isEmpty } from '@shared/util'
import { mapGetters } from 'vuex'
import cartesianSku from '../../../../../shared/util/cartesianSku'
export default {
  components: {
    SaleAttribute,
    SkuTable
  },
  data () {
    return {
      tableData: [],
      // 选中的属性Id列表
      selectAttrIdList: [],
      skuConfig: {
        supplyPrice: '',
        skuCode: '',
        tagSize: '',
        weight: ''
      },
      originData: [],
      attributeMap: new Map()
    }
  },
  computed: {
    ...mapGetters('product',
      [
        'productParams',
        'categoryData',
        'productSalesAttributeDetail',
        'saleAttrs',
        'checkedAttrs',
        'categoryId',
        'comparisonSaleAttrs'
      ]),
    specification () {
      return this.curSaleAttrs.find(attr => attr.saleAttributeType && attr.saleAttributeType.value === 3) || {}
    },
    curSaleAttrs () {
      return this.productParams.mode === 'create' ? this.saleAttrs : this.comparisonSaleAttrs
    }
  },
  watch: {
    'categoryId': {
      handler () {
        this.initData()
      },
      immediate: true
    }
  },
  methods: {
    initData () {
      const { productSalesAttributes } = this.productSalesAttributeDetail
      if (isEmpty(productSalesAttributes)) return
      const currentIds = [
        ...new Set(
          productSalesAttributes
            .map(item => item.productCategorySalesAttributes.map(k => k.attributeId))
            .flat()
            .filter(item => !!item)
        )
      ]
      this.selectAttrIdList = this.genAvaliableSelectAttribute(currentIds)
      this.tableData = productSalesAttributes.map(attr => {
        const { productCategorySalesAttributes, skuCode, supplyPrice, tagSize, weight, id } = attr
        const salesAttributes = productCategorySalesAttributes.map(sale => {
          const { attributeId, attributeTermId } = sale
          return {
            attributeId,
            attributeTermId
          }
        })
        return {
          attributes: salesAttributes,
          skuCode,
          supplyPrice,
          tagSize,
          weight,
          id
        }
      })
    },
    genAvaliableSelectAttribute (attributeIds) {
      // 查找当前销售属性
      return attributeIds
        .map(attributeId => {
          const el = this.curSaleAttrs.find(
            k => k.id === attributeId
          )
          return {
            attributeId: attributeId,
            saleAttributeType: el.saleAttributeType.value
          }
        })
        .reduce((prev, current) => {
          const index = prev.findIndex(
            k => k.saleAttributeType === current.saleAttributeType
          )
          if (index !== -1) {
            prev[index].attributeIds.push(current.attributeId)
          } else {
            prev.push({
              saleAttributeType: current.saleAttributeType,
              attributeIds: [current.attributeId]
            })
          }
          return prev
        }, [])
    },
    // 销售属性变动
    handleAttribute (currentData, refreshTable) {
      const standardAttributeIds = this.genAttributeRecord(currentData)
      this.genSkuTable(currentData, standardAttributeIds)
      this.setAttrsInfo(currentData)
    },
    setAttrsInfo (currentData) {
      this.$store.commit(
        'product/SET_CHECKED_ATTRS',
        currentData
      )
      this.$store.commit('product/SET_ATTRS_CHANGED', currentData)
    },
    genAttributeRecord (data) {
      // 用于记录用户选中哪些销售属性和其属性值
      const attributeMap = new Map()
      // 用于记录规格选中的属性值
      const specificationTermIds = []
      data.forEach(item => {
        specificationTermIds.push(item.mainAttributeTermId)
        item.relatedAttributeAndTermList.forEach(relate => {
          const attributeId = relate.attributeId
          const attributeTermIds = relate.attributeTermIds.map(attributeTermId => attributeTermId.id || attributeTermId) || []
          const stashTermIds = attributeMap.get(attributeId) || []
          attributeMap.set(attributeId, [
            ...new Set([...attributeTermIds, ...stashTermIds])
          ])
        })
      })
      attributeMap.set(
        this.specification.id,
        specificationTermIds
      )
      this.attributeMap = attributeMap
      return this.genAvaliableSelectAttribute([...attributeMap.keys()])
    },
    attributeTerm (attributeTermIds) {
      return attributeTermIds && attributeTermIds.id ? attributeTermIds.id : attributeTermIds
    },
    // 生成sku列表
    genSkuTable (data, standardAttributeIds) {
      const oldTableData = deepClone(this.tableData)
      const codes = this.genSkuTableCodes(data)
      const tableData = codes.map(item => {
        const obj = {
          attributes: standardAttributeIds.map(attribute => {
            const matchAttribute = item.find(attr =>
              attribute.attributeIds.includes(attr.attributeId)
            )
            return matchAttribute || {}
          }),
          ...this.skuConfig
        }
        return obj
      })
      // 生成新的表格
      this.tableData = this.recoverTableData(oldTableData, tableData)
      this.selectAttrIdList = standardAttributeIds
    },
    // 销售属性更新，生成新的sku列表，并且恢复之前有的数据
    recoverTableData (oldTableData, tableData) {
      tableData.forEach((item, index) => {
        const el = oldTableData.find(zItem => {
          // 判断销售属性是否一致
          if (item.attributes.length !== zItem.attributes.length) {
            return false
          }
          const newIds = item.attributes
            .map(k => k.attributeTermId)
            .filter(item => !!item)
          const oldIds = zItem.attributes
            .map(k => k.attributeTermId)
            .filter(item => !!item)
          return this.isArrayEqual(newIds, oldIds)
        })
        el && this.$set(tableData, index, el)
      })
      return tableData
    },
    // 判断两个数组内容是否相同
    isArrayEqual (a, b) {
      const c = [...new Set([...a, ...b])].length
      return c === a.length && c === b.length
    },
    // 生成SKU列表的Codes
    genSkuTableCodes (data) {
      let codes = []
      data.forEach(item => {
        const specificationData = [
          {
            attributeId: this.specification.id,
            attributeTermId: item.mainAttributeTermId
          }
        ]
        const attrsData = item.relatedAttributeAndTermList
          .map(relate => {
            const attributeId = relate.attributeId
            const attributeTermIds = relate.attributeTermIds || []
            return attributeTermIds.map(attributeTermId => {
              return {
                attributeId: attributeId,
                attributeTermId: attributeTermId.id || attributeTermId
              }
            })
          })
          .filter(item => !!item.length)
        const skuItem = [specificationData, ...attrsData]
        codes = codes.concat(cartesianSku(skuItem))
      })
      return codes
    },
    // 获取提交数据
    genSubmitData () {
      return {
        productSalesAttributes: this.genTableData(this.tableData),
        productMainAttributeAndTerm: this.genProductMainAttributeAndTerm(deepClone(
          this.checkedAttrs
        ))
      }
    },
    genTableData (tableData) {
      // 提交表格数据数据结构
      const tables = tableData.map(table => {
        const { attributes, ...rest } = table
        const productCategorySalesAttributes = attributes
        return {
          productCategorySalesAttributes,
          ...rest
        }
      })
      return tables
    },
    genProductMainAttributeAndTerm (checkedAttrs) {
      // 提交关联关系数据结构
      const productMainAttributeAndTerm = {}
      const relatedAttributeAndTermList = checkedAttrs.map(attr => {
        const { relatedAttributeAndTermList, mainAttributeTermId, mainAttributeId } = attr
        productMainAttributeAndTerm['mainAttributeId'] = mainAttributeId
        const terms = { mainAttributeTermId, relatedAttributeAndTermList }
        if (this.productParams.mode === 'modify') {
          relatedAttributeAndTermList.forEach(term => {
            const { attributeTermIds } = term
            const attributeIds = attributeTermIds.reduce((init, term) => {
              if (term.extendCode === 'NZ011') {
                init.push(term.id)
              } else {
                init.push(term)
              }
              return init
            }, [])
            term.attributeTermIds = attributeIds
          })
        }
        return {
          ...terms
        }
      })
      productMainAttributeAndTerm['productMainAttributeTermRelationList'] = relatedAttributeAndTermList
      return productMainAttributeAndTerm
    },
    // 校验数据
    validateData () {
      let err = false
      const checkedAttrs = this.checkedAttrs

      let hasEmptySaleAttribute = checkedAttrs.length === 0
      checkedAttrs.forEach(attribute => {
        attribute.relatedAttributeAndTermList.forEach(
          relatedAttribute => {
            if (isEmpty(relatedAttribute.attributeTermIds)) {
              hasEmptySaleAttribute = true
            }
          }
        )
      })
      if (hasEmptySaleAttribute) {
        this.$message.error('sku信息销售属性未选择完全')
        err = true
        return err
      }

      let supplyPrice = this.tableData.every(item => item.supplyPrice)
      if (!supplyPrice) {
        this.$message.error('供货价格，不能为空')
        err = true
        return err
      }

      let weight = this.tableData.every(item => item.weight)
      if (!weight) {
        this.$message.error('带包装重量，不能为空')
        err = true
        return err
      }
      let tagSize = this.tableData.every(item => item.tagSize)
      if (!tagSize) {
        this.$message.error('商家吊牌尺码，不能为空')
        err = true
        return err
      }
      return err
    },
    result () {
      return new Promise((resolve) => {
        if (!this.validateData()) {
          resolve({ 'productSalesAttributes': this.genSubmitData() || [] })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.skuInfo {
  margin-bottom: 2rem;
  .sku-info-content {
    padding: 0 12rem;
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    .no-data--tip {
      flex: 1;
      text-align: center;
      color: #909399;
    }
  }
  &-table {
    width: 100%;
  }
  &-tab {
    width: 100%;
  }
}
</style>
