<template>
  <div class="productSize">
    <el-card>
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form" v-if="showTable">
        <el-form :model="form" ref="form" class="productSize-from">
          <div class="productSize-from__table">
            <el-table :data="form.sizeInfoList" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="`${item.name}${index}`"
                :label="item.name"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{showLabels[scope.row.attributeTermId+'']}}</div>
                    <el-input
                      v-else
                      v-model="scope.row[item.id]"
                      v-input-filter:specialIntDecimalsFilter
                      maxlength="15"
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
    ...mapGetters('product', ['productBase', 'checkedSizes', 'productParams', 'categoryData', 'sizeAttr', 'sizeStandard', 'productSize', 'showSaleLabel']),
    productStatus () {
      return this.productBase.status
    },
    tableHeadData () {
      const sizes = {
        id: 'size',
        name: this.showSaleLabel.size,
        status: 'text'
      }
      return [sizes, ...this.sizeStandardHeadData]
    },
    sizeStandardHeadData () {
      let categoryAttributeTerms = deepClone(this.sizeStandard.terms) || []
      // 禁用和删除的属性值都不展示
      const filterCategoryUsable = categoryAttributeTerms.filter(categoryTerms => categoryTerms.usable)
      return filterCategoryUsable
    },
    showTable () {
      const sizeStandardTerms = this.sizeStandard.terms
      const hasSizeStandard = !isEmpty(sizeStandardTerms) // 存在尺码标准属性值
      const checkedSizes = !isEmpty(this.checkedSizes) // 存在选中的尺码
      const hasProductSizeStandard = this.productSize.sizeInfoList
      return (hasSizeStandard && checkedSizes) || (!hasSizeStandard && hasProductSizeStandard)
    },
    productAttributeTerms () {
      const sizePositions = this.productSize.sizeInfoList ? this.productSize.sizeInfoList[0].sizePositions : []
      return sizePositions.map(position => position.attributeTerm)
    }
  },
  watch: {
    'checkedSizes': {
      handler (newValue) {
        // 选中尺寸(包含回填)
        let hasShowSizeInfo = []
        const sizeInfoList = this.productSize.sizeInfoList || []
        if (!isEmpty(sizeInfoList)) {
          hasShowSizeInfo = newValue.map(checkSize => {
            // 回填数据
            let positonItems = {}
            sizeInfoList.forEach(sizeInfo => {
              if (checkSize.id === sizeInfo.attributeTermId) {
                sizeInfo.sizePositions.forEach(sizeStandard => {
                  positonItems[sizeStandard.attributeTermId] = sizeStandard.value
                })
              }
            })
            return { ...checkSize, ...positonItems }
          })
        }
        const addSizeInfo = !isEmpty(hasShowSizeInfo) ? hasShowSizeInfo : newValue
        this.addListItem(addSizeInfo)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    addListItem (sizes) {
      // 增加行
      const sizeInfoList = []
      const showLabels = {}
      let attributeId = ''
      if (!isEmpty(this.productSize.sizeInfoList)) {
        attributeId = this.productSize.sizeInfoList[0].attributeId
      }
      sizes.forEach(size => {
        const { attributeTermId, ...rest } = size
        const sizeAttrAttributeId = this.sizeAttr.attributeId ? this.sizeAttr.attributeId : attributeId
        const addItem = {
          attributeId: sizeAttrAttributeId,
          attributeTermId: size.id || attributeTermId,
          ...rest
        }
        const sizeTerms = this.sizeAttr.terms || []
        size.id ? showLabels[size.id] = size.name : showLabels[size.attributeTermId] = sizeTerms.find(attr => attr.id === size.attributeTermId).name
        sizeInfoList.push(addItem)
      })
      this.showLabels = showLabels
      this.form.sizeInfoList = this.stashTableInfo(sizeInfoList)
    },
    /**
    * 暂存尺码之前输入记录和回显
    */
    stashLastData () {
      const sizeInfoList = this.form.sizeInfoList || []
      sizeInfoList.forEach((stashSize) => {
        this.stashTableData.set(`${stashSize.attributeTermId}`, stashSize)
      })
    },
    /**
     * 销售属性变化根据暂存数据/编辑状态进行回显赋值
     * * @param {Array} saleData 销售属性变化后的数据结构
  */
    stashTableInfo (sizeInfoList) {
      this.stashLastData()
      if (sizeInfoList && sizeInfoList.length > 0) {
        sizeInfoList.forEach((tableItem) => {
          const value = this.stashTableData.get(`${tableItem.attributeTermId}`)
          Object.assign(tableItem, value)
        })
        return sizeInfoList
      }
    },
    result () {
      return new Promise(resolve => {
        let productSize = {}
        const sizelist = this.form.sizeInfoList || []
        const sizeInfoList = sizelist.map((size) => {
          const { attributeTermId, attributeId } = size
          // 新增使用分类标准尺码
          const standardIds = this.sizeStandardHeadData.map(standard => standard.id)
          const sizePositions = standardIds.map(key => {
            return size[key] ? { 'attributeTermId': key, value: size[key] } : { 'attributeTermId': key, value: '' }
          })
          return { sizePositions, attributeTermId, attributeId }
        })
        productSize['sizeInfoList'] = sizeInfoList
        productSize.id = this.productSize.id
        resolve({ 'productSize': productSize || [] })
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
