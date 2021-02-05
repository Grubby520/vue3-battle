<template>
  <div class="productSize">
    <el-card v-if="showProductSizePage">
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" class="productSize-from">
          <div class="productSize-from__table">
            <el-table :data="form.sizeInfoList" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="item in tableHeadData"
                :key="item.name"
                :label="item.name"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{showLabels[scope.row.attributeTermId+'']}}</div>
                    <el-input v-else v-model="scope.row[item.id]" />
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
export default {
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
    ...mapGetters('product', ['checkedSizes', 'sizeAttr', 'sizeStandard', 'productSize']),
    tableHeadData () {
      // 表头信息
      const sizes = {
        id: 'size',
        name: this.sizeAttr.name,
        status: 'text'
      }
      // 回显情况的表头
      let echoSizeStandard = []
      const sizePositions = !isEmpty(this.productSize.sizeInfoList) ? this.productSize.sizeInfoList[0].sizePositions : []
      const sizeStandardTerms = this.sizeStandard.terms || []
      const sizeStandardIds = sizeStandardTerms.reduce((init, standard) => init.concat(standard.id), [])
      if (sizePositions && sizePositions.length > 0) {
        echoSizeStandard = sizePositions.map(options => {
          if (!sizeStandardIds.includes(options.attributeTermId)) {
            options.attributeTerm.name = `${options.attributeTerm.name}(已删除)`
          }
          return { id: options.attributeTermId, name: options.attributeTerm.name }
        })
      }
      return !isEmpty(echoSizeStandard) ? this.deduplication([sizes, ...echoSizeStandard || []], 'id') : this.deduplication([sizes, ...sizeStandardTerms], 'id')
    },
    showProductSizePage () {
      return !isEmpty(this.checkedSizes) || !isEmpty(this.productSize.sizeInfoList)
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
      sizes.forEach(size => {
        const { attributeTermId, ...rest } = size
        const addItem = {
          attributeId: this.sizeAttr.attributeId,
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
    result () {
      return new Promise(resolve => {
        let productSize = {}
        const sizeInfoList = this.form.sizeInfoList.map((size) => {
          const { attributeTermId, attributeId } = size
          const sizeStandardTerms = this.sizeStandard.terms || []
          const sizeStandard = sizeStandardTerms.map(standard => standard.id)
          const sizePositions = sizeStandard.map(key => {
            if (size[key]) {
              return { 'attributeTermId': key, value: size[key] }
            } else {
              return { 'attributeTermId': key, value: '' }
            }
          })
          return { sizePositions, attributeTermId, attributeId }
        })
        productSize['sizeInfoList'] = sizeInfoList
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
    padding: 0 0 0 120px;
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
