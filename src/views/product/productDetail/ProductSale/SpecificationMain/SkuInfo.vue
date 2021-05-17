<template>
  <el-card>
    <div slot="header">
      <span>详情描述</span>
    </div>
    {{selectAttrIdList}}
    <div class="sku-info-content">
      <SaleAttribute
        :table-data="tableData"
        :cur-sale-attrs="curSaleAttrs"
        @change="handleAttribute"
        ref="saleAttribute"
      ></SaleAttribute>
      <SkuTable
        v-model="tableData"
        :cur-sale-attrs="curSaleAttrs"
        :attribute-map="attributeMap"
        :select-attr-id-list="selectAttrIdList"
      ></SkuTable>
    </div>
    <!-- <div class="no-data" v-else>
      <span class="no-data--tip">~暂无数据~</span>
    </div>-->
  </el-card>
</template>

<script>
import SkuTable from './SkuTable'
import SaleAttribute from './SaleAttribute'
import { deepClone } from '@shared/util'
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
  created () {

  },
  mounted () {
    // this.initData()
  },
  computed: {
    ...mapGetters('product', ['productParams', 'categoryData', 'productSalesAttributeDetail']),
    specification () {
      const specification =
        this.curSaleAttrs.find(attr => attr.extendCode === 'NZ012') ||
        {}
      return specification
    },
    curSaleAttrs () {
      // 新建筛掉已禁用属性、属性值
      return this.categoryData.filter(item => item.usable)
    },
    curSaleAttrsMap () {
      const attrsMap = new Map()
      this.curSaleAttrs.forEach(attribute => {
        attrsMap.set(attribute.attributeId, attribute)
      })
      return attrsMap
    },
    // 处理完整的销售属性
    completeSaleAttrs () {
      // todo 此处需要考虑删除逻辑 借鉴旧的
      return this.curSaleAttrs
    }
  },
  methods: {
    initData () {
      // 回填数据 variantPlate 销售属性 variants尺码表数据
      // const { variantPlate: { variants = [] } = {} } = this.productInfo
      // const currentIds = [
      //   ...new Set(
      //     productSize
      //       .map(item => item.attributes.map(k => k.attributeId))
      //       .flat()
      //       .filter(item => !!item)
      //   )
      // ]
      // this.selectAttrIdList = this.genAvaliableSelectAttribute(currentIds)
      // console.log('selectAttrIdList', this.selectAttrIdList)
      // this.tableData = variants.map((variant, index) => {
      //   return {
      //     ...variant,
      //     initialStatus: variant.status
      //   }
      // })
    },
    genAvaliableSelectAttribute (attributeIds) {
      return attributeIds
        .map(attributeId => {
          const el = this.curSaleAttrs.find(
            k => attributeId === k.id
          )
          return {
            attributeId: attributeId,
            saleAttributeType: el.saleAttributeType.value
          }
        })
        .reduce((prev, current) => {
          const index = prev.findIndex(
            k => k.saleAttributeType === current.saleAttributeType.value
          )
          if (index > 0) {
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
      // * 如果是表格点删除导致的销售属性变动，则不会进行刷新表格
      if (refreshTable) {
        this.genSkuTable(currentData, standardAttributeIds)
      }
      this.setAttrsInfo(currentData)
    },
    setAttrsInfo (currentData) {
      // todo 此处修改关联产品图片和尺码对照表
      this.$store.commit(
        'product/SET_CHECKED_ATTRS',
        currentData
      )
      this.$store.commit('product/SET_ATTRS_CHANGED')
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
          const attributeTermIds = relate.attributeTermIds || []
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
    // 生成sku列表
    genSkuTable (data, standardAttributeIds) {
      console.log('data', data)
      const oldTableData = deepClone(this.tableData)
      const codes = this.genSkuTableCodes(data)
      console.log('codes', codes)
      // console.log('standardAttributeIds', standardAttributeIds)
      const tableData = codes.map(item => {
        const obj = {
          attributes: standardAttributeIds.map(attribute => {
            const matchAttribute = item.find(attr => {
              // console.log('attr', attr)
              attribute.attributeIds.includes(attr.attributeId)
            }
            )
            return matchAttribute || {}
          }),
          ...this.skuConfig
        }
        return obj
      })
      console.log('tableData', tableData)
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
                attributeTermId
              }
            })
          })
          .filter(item => !!item.length)
        const skuItem = [specificationData, ...attrsData]
        codes = codes.concat(cartesianSku(skuItem))
      })
      return codes
    }
  }
}
</script>

<style scoped lang="scss">
</style>
