<template>
  <el-table
    :data="tableData"
    class="tableData"
    @selection-change="handleSelectionChange"
    :border="border"
    size="mini"
    ref="multipleTable"
  >
    <el-table-column
      v-if="selection"
      type="selection"
      width="55"
      fixed
      :selectable="checkSelectable"
    />
    <div v-for="item in columns" :key="item.label">
      <template v-if="item.isImg">
        <el-table-column align="center" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <SlImage size="10rem" :src="scope.row[item.prop]" />
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-else
        align="center"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="tooltip"
      >
        <template slot-scope="scope">
          <div class="tableData-col">
            <el-row type="flex" align="middle">
              <el-col :span="10" v-if="item.isInImg">
                <SlImage size="10rem" :src="scope.row[item.isInImg]" />
              </el-col>

              <el-col :span="item.isInImg?14:24">
                <div v-if="item.pre" :class="{'tableData-col-pre' : !item.isInImg && item.pre }">
                  <div class="tableData-col-con">
                    <div v-for="(pr, ins) in item.pre" :key="pr">
                      <span>{{ pr }}:</span>
                      <span>{{format(scope.row[ins]) }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="tableData-col-text">{{format(scope.row[item.prop]) }}</div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
    </div>
    <el-table-column width="180px" align="center" label="操作" v-if="operate">
      <template slot-scope="scope">
        <slot name="operation" :row="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'SlTable',
  model: {
    event: 'changeSelection'
  },
  props: {
    tableData: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },

    border: { type: Boolean, required: false, default: true },
    selection: { type: Boolean, required: false, default: true },
    operate: { type: Boolean, required: false, default: true },
    tooltip: { type: Boolean, required: false, default: true },
    selectionsDisabled: { type: Array, required: false, default: () => { return [] } }
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('changeSelection', val)
    },
    checkSelectable (row) {
      // 复选框置灰selectionsDisabled为需要置灰的数组
      let mark = 0
      this.selectionsDisabled.forEach((item) => {
        if (item.id === row.id) {
          mark = mark + 1
          return false
        }
      })
      return mark <= 0
    },
    format (val) {
      // 值如果是时间格式转化为时间格式
      if (isNaN(val) && !isNaN(Date.parse(val))) {
        return this.$moment(val).format('YYYY-M-D HH:mm')
      } else {
        return val
      }
    }
  }
}
</script>
<style lang="scss">
.tableData {
  &-col {
    &-img {
      width: 10rem;
      height: 10rem;
      margin-right: 1rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &-pre {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-con {
      text-align: left;
    }
  }
  /deep/ .cell {
    text-align: center;
  }
}
</style>
