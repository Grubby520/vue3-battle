<template>
  <div class="ProductSize">
    <el-card v-if="sizestandard.terms&&sizestandard.terms.length > 0">
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" class="ProductSize-from">
          <div class="ProductSize-from__table">
            <el-table :data="form.sizeInfoList" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
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
    ...mapGetters('product', ['sizeOptions', 'sizeAttr', 'sizestandard', 'productsize']),
    tableHeadData () {
      // 表头信息
      const sizes = {
        id: 'size',
        name: this.sizeAttr.name,
        status: 'text'
      }
      return this.deduplication([sizes, ...this.sizestandard.terms], 'id')
    }
  },
  watch: {
    'sizeOptions': {
      handler (newValue) {
        this.addListItem(newValue)
      },
      immediate: true,
      deep: true
    },
    'productsize.sizeInfoList': {
      handler (newValue) {
        if (newValue && newValue.length > 0) {
          const sizeInfoList = newValue.map(size => {
            const standardIds = size.sizePositions.reduce((init, a) => {
              init[a.attributeTermId] = a.value
              return init
            }, {})
            return { ...standardIds, attributeId: size.attributeId, attributeTermId: size.attributeTermId }
          })
          this.addListItem(sizeInfoList)
        }
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
        size.id ? showLabels[size.id] = size.name : showLabels[size.attributeTermId] = this.sizeAttr.terms.find(attr => attr.id === size.attributeTermId).name
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
        const productSize = this.form.sizeInfoList.map((size) => {
          const { attributeTermId, attributeId, ...rest } = size
          const sizePositions = []
          for (const key in rest) {
            const sizeItem = {}
            sizeItem['attributeTermId'] = key
            sizeItem['value'] = rest[key]
            sizePositions.push(sizeItem)
          }
          return { sizePositions, attributeTermId, attributeId }
        })
        resolve({ 'productSize': productSize })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ProductSize {
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
