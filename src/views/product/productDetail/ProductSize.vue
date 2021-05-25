<template>
  <div class="productSize">
    <el-card>
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form" v-if="showTable">
        <el-form :model="form" ref="form" class="productSize-from">
          <div class="productSize-from__table">
            <el-table
              :data="form.sizeInfoList"
              style="width:100%;"
              row-key="key"
              border
              class="pointer-enable"
            >
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="`${item.name}${index}`"
                :label="item.name"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{showLabels[getSizeInfoKey(scope.row)]}}</div>
                    <el-input
                      v-else
                      v-model="scope.row[item.id]"
                      v-input-filter:specialIntDecimalsFilter
                      maxlength="15"
                      class="pointer-disable"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
      <p class="align-center no-data" v-else>~暂无数据~</p>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone, isEmpty } from '@shared/util'
import inputFilter from '@shared/directives/inputFilter/index.js'
export default {
  directives: {
    inputFilter
  },
  data () {
    return {
      form: {
        sizeInfoList: []
      },
      showLabels: {},
      tableData: [],
      stashTableData: new Map()
    }
  },
  computed: {
    ...mapGetters('product',
      ['productBase',
        'checkedSizes',
        'productParams',
        'categoryData',
        'sizeAttr',
        'sizeStandard',
        'productSize',
        'showSaleLabel',
        'specificationMain',
        'checkedAttrs',
        'hasAttrsChanged',
        'comparisonSaleAttrs']),
    productStatus () {
      return this.productBase.status
    },
    tableHeadData () {
      const sizes = {
        id: 'size',
        name: '尺码',
        status: 'text'
      }
      return [sizes, ...this.sizeStandardHeadData]
    },
    sizeStandardHeadData () {
      let categoryAttributeTerms = []
      if (this.sizeStandard && !isEmpty(this.sizeStandard.terms)) {
        categoryAttributeTerms = deepClone(this.sizeStandard.terms)
      }
      // 禁用和删除的属性值都不展示
      const filterCategoryUsable = categoryAttributeTerms.filter(categoryTerms => categoryTerms.usable)
      return filterCategoryUsable
    },
    showTable () {
      const sizeStandardTerms = this.sizeStandard.terms
      const hasSizeStandard = !isEmpty(sizeStandardTerms) // 存在尺码标准属性值
      const checkedSizes = this.specificationMain ? !isEmpty(this.checkedAttrs) : !isEmpty(this.checkedSizes) // 存在选中的尺码
      return (hasSizeStandard && checkedSizes)
    },
    productAttributeTerms () {
      const sizePositions = this.productSize.sizeInfoList ? this.productSize.sizeInfoList[0].sizePositions : []
      return sizePositions.map(position => position.attributeTerm)
    }
  },
  watch: {
    'checkedSizes': {
      handler (newValue) {
        if (this.specificationMain) {
          return
        }
        const sizeInfoList = this.productSize.sizeInfoList || []
        // 选中尺寸(包含回填)
        const hasShowSizeInfo = newValue.map(checkSize => {
          // 回填数据
          let positonItems = {}
          sizeInfoList.forEach(sizeInfo => {
            if (checkSize.id === sizeInfo.attributeTermId) {
              sizeInfo.sizePositions.forEach(sizeStandard => {
                positonItems[sizeStandard.attributeTermId] = sizeStandard.value
              })
            }
          })
          return { ...checkSize, ...positonItems, specificationId: null, attributeTermId: checkSize.id }
        })
        this.addListItem(hasShowSizeInfo)
      },
      immediate: true,
      deep: true
    },
    hasAttrsChanged: {
      handler () {
        if (this.specificationMain) {
          const sizeInfoList = this.productSize.sizeInfoList || []
          const checkedAttrs = deepClone(this.checkedAttrs)
          const sizeList = this.structureSizeList(checkedAttrs)
          const showSizeInfo = this.structureShowSizeInfo(sizeList, sizeInfoList)
          this.addListItem(showSizeInfo)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    structureSizeList (checkedAttrs) {
      return checkedAttrs.map(specificationTerm => {
        const specificationTermId = specificationTerm.mainAttributeTermId
        const sizeIds = this.comparisonSaleAttrs.filter(attr => attr.saleAttributeType.value === 2).map(attr => attr.id)
        return specificationTerm.relatedAttributeAndTermList.filter(relatedAttribute => sizeIds.includes(relatedAttribute.attributeId)).map(relatedAttribute => {
          return relatedAttribute.attributeTermIds.map((attributeTerm) => {
            return {
              ...attributeTerm,
              attributeId: relatedAttribute.attributeId,
              attributeTermId: attributeTerm.id,
              specificationId: specificationTermId,
              specificationTermName: specificationTerm.mainAttributeTermName
            }
          })
        })
      }).flat().flat()
    },
    structureShowSizeInfo (sizeList, sizeInfoList) {
      return sizeList.map(checkSize => {
        // 回填数据
        let positonItems = {}
        const sizeInfo = sizeInfoList.find(sInfo => checkSize.attributeTermId === sInfo.attributeTermId && checkSize.specificationId === sInfo.specificationId)
        if (sizeInfo) {
          sizeInfo.sizePositions.forEach(sizeStandard => {
            positonItems[sizeStandard.attributeTermId] = sizeStandard.value
          })
        }
        return { ...checkSize, ...positonItems }
      })
    },
    getSizeInfoKey (sizeInfo) {
      return this.specificationMain ? `${sizeInfo.specificationId}-${sizeInfo.attributeTermId}` : sizeInfo.attributeTermId
    },
    addListItem (sizeInfoList) {
      const showLabels = {}
      sizeInfoList.forEach(sizeInfo => {
        const specificationName = this.specificationMain ? `${sizeInfo.specificationTermName}：` : ''
        const showLabelId = this.getSizeInfoKey(sizeInfo)
        showLabels[showLabelId] = `${specificationName}${sizeInfo.name}`
      })
      this.showLabels = showLabels
      this.form.sizeInfoList = this.stashTableInfo(sizeInfoList)
    },
    /**
    * 暂存尺码之前输入记录和回显
    */
    stashLastData () {
      const sizeInfoList = this.form.sizeInfoList || []
      sizeInfoList.forEach((sizeInfo) => {
        this.stashTableData.set(this.getSizeInfoKey(sizeInfo), sizeInfo)
      })
    },
    /**
   * 销售属性变化根据暂存数据/编辑状态进行回显赋值
   * * @param {Array} saleData 销售属性变化后的数据结构
*/
    stashTableInfo (sizeInfoList) {
      this.stashLastData()
      if (sizeInfoList && sizeInfoList.length > 0) {
        sizeInfoList.forEach((sizeInfo) => {
          const value = this.stashTableData.get(this.getSizeInfoKey(sizeInfo))
          Object.assign(sizeInfo, value)
        })
        return sizeInfoList
      }
    },
    result () {
      return new Promise(resolve => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let productSize = {}
            if (this.showTable) {
              const sizelist = this.form.sizeInfoList || []
              const sizeInfoList = sizelist.map((size) => {
                const { attributeTermId, specificationId, attributeId } = size
                // 新增使用分类标准尺码
                const standardIds = this.sizeStandardHeadData.map(standard => standard.id)
                const sizePositions = standardIds.map(key => {
                  return size[key] ? { 'attributeTermId': key, value: size[key] } : { 'attributeTermId': key, value: '' }
                })
                return { sizePositions, attributeTermId, specificationId, attributeId }
              })
              productSize['sizeInfoList'] = sizeInfoList
              productSize.id = this.productSize.id
            }
            resolve({ 'productSize': productSize })
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.productSize {
  margin-bottom: 2rem;
  &-from {
    padding: 0 0 0 12rem;
    &__table {
      /deep/ .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
  /deep/.el-input--small .el-input__inner {
    text-align: center;
  }
}
</style>
