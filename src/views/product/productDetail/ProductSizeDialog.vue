<template>
  <div class="sizeDialog">
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

      <div class="sizeDialog-title">
        <span>尺码</span>
      </div>
      <div class="sizeDialog-area">
        <div class="sizeDialog-area__content">
          <div class="check-area">
            <el-checkbox-group v-model="checkedSizes">
              <template v-for="(item, index) in sizeOptions">
                <el-checkbox :key="index" :label="item.id">{{item.name}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
          <div class="table-area">
            <h2>尺码对照表</h2>
            <el-table :data="sizeTable" border max-height="400">
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :label="item.name"
                :key="index"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="item.id === 'size'">{{scope.row.size.name}}</span>
                  <span v-else>{{showControlDataItem(scope.row[item.id])}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <p class="sizeDialog-warm">已存在的属性值不可取消，若要修改SKU的颜色、尺码属性值，请联系商品负责人进行修改</p>
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
export default {
  props: {
    formSizes: {
      type: Array,
      default: function () {
        return []
      }
    },
    sizeOptions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      checkedSizes: [],
      sizeContrastTableList: [],
      hints: ['注意事项：', '1、查看下方尺码对照表，根据适用身高、体重匹配对应商品尺码；', '2、商品尺码偏大或偏小，请务必调整尺码号，按照合适尺码发货；']
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'sizeAttr', 'sizestandard']),
    tableHeadData () {
      // 表头数据信息
      const standardData = this.sizestandard.terms || []
      const tableHeader = standardData.filter(size => this.sizeContrastTableList.some(com => size.id === com.sizeStandardId))
      const sizeHeader = {
        id: 'size',
        name: '尺码段'
      }
      return this.sizeContrastTableList && this.sizeContrastTableList.length > 0 ? [sizeHeader, ...tableHeader] : []
    },
    sizeTable () {
      const sizeSegments = {}
      // 表格尺码段列数据
      const attributes = this.sizeAttr.terms
      // 表格数据处理前需要先排序
      const sizeTable = this.sortTable(this.sizeContrastTableList, 'priority')
      // sizeSegmentId 属性值id  sizeStandardId尺码标准id（表头）
      sizeTable.forEach(size => {
        if (!sizeSegments[size.sizeSegmentId]) {
          sizeSegments[size.sizeSegmentId] = [size]
        } else {
          sizeSegments[size.sizeSegmentId].push(size)
        }
      })

      const tableRows = []
      for (const key in sizeSegments) {
        const rowData = {}
        rowData.size = attributes.find(col => `${col.id}` === key)
        sizeSegments[key].forEach(size => {
          rowData[size.sizeStandardId] = [size.minValue, size.maxValue, size.id]
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
    open () {
      this.dialogVisible = true
      this.getSizeTable()
    },
    getSizeTable () {
      // let params = {
      //   categoryId: this.productParams.categoryId
      // }
      RecommendApi.pageList(2)
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
  $textAlign: center;
  &-warm {
    @extend .hintTiles;
    text-align: $textAlign;
    padding-top: 3rem;
  }
  &-title {
    height: 4rem;
    width: 10rem;
    line-height: 4rem;
    background: #fff6f6;
    text-align: $textAlign;
    border: 1 solid #ebeef5;
    border-radius: 5px;
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
          text-align: $textAlign;
          margin-bottom: 2rem;
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    text-align: $textAlign;
    .el-button {
      margin-right: 4rem;
    }
  }
}
</style>
