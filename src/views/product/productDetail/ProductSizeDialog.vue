<template>
  <div class="sizeDialog" v-if="dialogVisible">
    <el-dialog
      title="尺码设置"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="hintTiles">
        <p v-for="(hint,index) in hints" :key="index">{{hint}}</p>
      </div>
      <div class="sizeDialog-title align-center">
        <span>尺码</span>
      </div>
      <div class="sizeDialog-area">
        <div class="sizeDialog-area__content">
          <div class="check-area">
            <el-checkbox-group v-model="checkedSizes">
              <template v-for="(item, index) in sizeOptions">
                <el-checkbox :disabled="usable" :key="index" :label="item.id">{{item.name}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
          <div class="table-area align-center">
            <h2>尺码对照表</h2>
            <el-table :data="sizeTableData" border max-height="400">
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :label="item.name"
                :key="index"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="item.id === 'size'">{{scope.row.size}}</span>
                  <span v-else>{{showControlDataItem(scope.row[item.id])}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <p class="sizeDialog-warm align-center">已存在的属性值不可取消，若要修改SKU的颜色、尺码属性值，请联系商品负责人进行修改</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'
import { mapGetters } from 'vuex'
import { isEmpty } from '@shared/util'
export default {
  data () {
    return {
      dialogVisible: false,
      checkedSizes: [],
      sizeOptions: [],
      formSizes: [],
      usable: {}, // 属性禁用
      sizeContrastTableList: [],
      hints: ['注意事项：', '1、查看下方尺码对照表，根据适用身高、体重匹配对应商品尺码；', '2、商品尺码偏大或偏小，请务必调整尺码号，按照合适尺码发货；']
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'sizeAttr', 'sizeStandard']),
    tableHeadData () {
      // 表头数据信息
      let tableHeader = []
      const standardData = this.sizeStandard.terms || []
      const sizeHeader = {
        id: 'size',
        name: '尺码段'
      }
      const standardDataIds = standardData.reduce((init, standardId) => init.concat(standardId.id), [])
      this.sizeContrastTableList.forEach(tableStandard => {
        // 去重复数据
        const hasSizeStandardId = tableHeader.some(header => header.id === tableStandard.sizeStandardId)
        if (!hasSizeStandardId) {
          if (standardDataIds.includes(tableStandard.sizeStandardId)) {
            tableHeader.push({
              id: tableStandard.sizeStandardId,
              name: tableStandard.sizeStandardName
            })
          }
        }
      })
      tableHeader.unshift(sizeHeader)
      return !isEmpty(this.sizeContrastTableList) ? tableHeader : []
    },
    sizeTableData () {
      const sizeSegmentMap = new Map()
      // 表格数据处理前需要先排序
      const sortSizeTable = this.sortTable(this.sizeContrastTableList, 'priority')
      // sizeSegmentId 属性值id  sizeStandardId尺码标准id（表头）
      sortSizeTable.forEach(size => {
        const sizeSegmentId = size.sizeSegmentId
        let sizeSegments = sizeSegmentMap.get(sizeSegmentId)
        if (isEmpty(sizeSegments)) {
          sizeSegmentMap.set(sizeSegmentId, [size])
        } else {
          sizeSegments.push(size)
        }
      })
      const tableRows = []
      for (const [key, value] of sizeSegmentMap.entries()) {
        const rowData = {}
        value.forEach(size => {
          if (!tableRows.some(row => row.sizeStandardId === size.sizeStandardId && row.sizeSegmentId === size.sizeSegmentId)) {
            const terms = this.sizeAttr.terms || []
            const sizeAttrIds = terms.reduce((init, a) => init.concat(`${a.id}`), [])
            sizeAttrIds.includes(`${key}`) ? rowData['size'] = size.sizeSegmentName : rowData['size'] = `${size.sizeSegmentName}`
            rowData[size.sizeStandardId] = [size.minValue, size.maxValue, size.id]
          }
        })
        tableRows.push(rowData)
      }
      return tableRows
    }
  },
  watch: {
    formSizes (val) {
      this.checkedSizes = val.map(item => item.id)
    }
  },
  methods: {
    open (data) {
      const { sizeOptions, formSizes, usable, showSaleLabel } = data
      this.sizeOptions = sizeOptions
      this.formSizes = formSizes
      this.dialogVisible = true
      this.usable = usable && !showSaleLabel['sizedeleted']
      this.getSizeTable()
    },
    getSizeTable () {
      RecommendApi.pageList(this.productParams.categoryId)
        .then(res => {
          this.sizeContrastTableList = res.data.sizeContrastTableList || []
        })
    },
    sortTable (arr, key) {
      return arr.sort((a, b) => {
        const x = a[key]
        const y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    /**
     * 展示尺码对照表的数据项
     * @param {Array} data 数据项
     * * data[0] 最小值
     * * data[1] 最大值
     */
    showControlDataItem (data) {
      if (data) {
        if (data.length < 0 || data.length > 3) {
          return ''
        } else if (data[0] === data[1]) {
          return data[0]
        } else {
          return [data[0], data[1]].join(' ~ ')
        }
      }
    },
    handleConfirm () {
      let formSizes = this.sizeOptions.filter(item => this.checkedSizes.includes(item.id))
      this.$emit('confirm', formSizes)
      this.handleClose()
    },
    handleClose () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>
<style lang="scss" scoped>
.sizeDialog {
  .hint {
    color: #f56c6c;
    padding-bottom: 2rem;
    line-height: 2rem;
  }
  .hintTiles {
    @extend .hint;
    p:nth-child(n + 2) {
      margin-left: 2rem;
    }
  }
  &-warm {
    @extend .hintTiles;
    padding-top: 3rem;
  }
  &-title {
    height: 4rem;
    width: 10rem;
    line-height: 4rem;
    background: #fff6f6;
    border: 1 solid #ebeef5;
    border-radius: 0.5rem;
  }
  &-area {
    padding: 4rem;
    background: #fff6f6;
    &__content {
      background: white;
      .check-area {
        padding: 4rem 4rem 3rem;
        border: 1px solid #ebeef5;
        margin-bottom: 2rem;
        /deep/ .el-checkbox {
          margin-bottom: 1rem;
        }
      }
      .table-area {
        h2 {
          margin-bottom: 2rem;
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    text-align: center;
    .el-button {
      margin-right: 4rem;
    }
  }
}
</style>
