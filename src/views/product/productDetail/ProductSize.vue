<template>
  <div class="productSize">
    <el-card>
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <p v-if="showProductSizeTable" class="align-center no-data">~暂无数据~</p>
      <div class="form" v-else>
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
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from '@shared/util'
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
    ...mapGetters('product', ['checkedSizes', 'productParams', 'categoryData', 'sizeAttr', 'productSize', 'showSaleLabel']),
    sizeStandard () {
      return this.categoryData.filter(categoryItem => categoryItem.extendCode === 'NZ013') || []
    },
    tableHeadData () {
      const sizes = {
        id: 'size',
        name: this.showSaleLabel.size,
        status: 'text'
      }
      // 回显情况的表头
      const sizePositions = this.productSize.sizeInfoList ? this.productSize.sizeInfoList[0].sizePositions : []
      let headStandard = []
      if (!isEmpty(sizePositions)) {
        const echoSizeStandard = sizePositions
          .map(saleSizeItem => {
            const { attributeTermId, attributeTerm } = saleSizeItem
            const saleSizeStatus = this.isSaleTermsStatus('NZ013', attributeTermId)
            if (saleSizeStatus.isDeleted) {
              saleSizeItem.attributeTerm.name = `${attributeTerm.name}(已删除)`
            } else if (!saleSizeStatus.isUsable) {
              saleSizeItem.attributeTerm.name = `${attributeTerm.name}(已禁用)`
            }
            return attributeTerm
          })
        headStandard = this.deduplication([sizes, ...echoSizeStandard || []], 'id')
      }
      return !isEmpty(headStandard) ? headStandard : this.deduplication([sizes], 'id')
    },
    showProductSizeTable () {
      const hasProductSize = !isEmpty(this.productSize.sizeInfoList)
      return (Object.keys(this.sizeStandard).length === 0 && !hasProductSize) || (this.checkedSizes.length === 0 && !hasProductSize) || isEmpty(this.sizeStandard)
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
        const addItem = {
          attributeId: this.sizeAttr.attributeId || attributeId,
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
    deduplication (data, primaryKey) {
      // 数组对象去重
      return data.reduce((pre, cur) => {
        const locationData = pre.find((item) => item[primaryKey] === cur[primaryKey])
        return locationData ? pre : pre.concat(cur)
      }, [])
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
    /**
   * 判断销售属性值是删除还是禁用
   */
    isSaleTermsStatus (extendCode, termId) {
      return this.categoryData
        .filter(cateTerm => cateTerm.extendCode === extendCode)
        .reduce((cateTermStatus, cateTerm) => {
          // 属性值如果被删除，展示属性值的状态，否则展示是否被禁用的状态
          let isUsable = false
          let isDeleted = false
          const termIds = cateTerm.terms.reduce((ids, term) => ids.concat(term.id), []) || []
          const termUsable = cateTerm.terms.find(term => term.id === termId) || {}
          if (!isEmpty(termIds)) isDeleted = !termIds.includes(termId)
          if (!isEmpty(termUsable)) isUsable = termUsable.usable
          cateTermStatus = isDeleted ? { isDeleted } : { isUsable }
          return cateTermStatus
        }, {})
    },
    result () {
      return new Promise(resolve => {
        let productSize = {}
        let echoSizes = []
        // 编辑使用回显标准尺码
        if (!isEmpty(this.productSize.sizeInfoList)) {
          echoSizes = this.productSize.sizeInfoList[0].sizePositions.reduce((init, size) => init.concat(size.attributeTermId), [])
        }
        const sizelist = this.form.sizeInfoList || []
        const sizeInfoList = sizelist.map((size) => {
          const { attributeTermId, attributeId } = size
          const sizeStandardTerms = this.sizeStandard.terms || []
          // 新增使用分类标准尺码
          const sizeStandard = sizeStandardTerms.map(standard => standard.id)
          const standardIds = echoSizes.length > 0 ? echoSizes : sizeStandard
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
