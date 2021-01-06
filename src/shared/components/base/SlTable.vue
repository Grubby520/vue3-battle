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
                    <div v-for="(value, key) in item.pre" :key="key">
                      <!--如果item.prop为空,表示数据直接取row中的字段,否则取item.prop的下级字段-->
                      <template v-if="!item.prop">
                        <p v-if="scope.row[key]">
                          <span>{{ value }}:</span>
                          <span>{{ scope.row[key] }}</span>
                        </p>
                      </template>
                      <template v-else>
                        <p v-if="scope.row[item.prop] && scope.row[item.prop][key]">
                          <span>{{ value }}:</span>
                          <span>{{ scope.row[item.prop][key] }}</span>
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
                <SlTableColFormat
                  v-else-if="item.render"
                  :row="scope.row"
                  :column="item"
                  :index="scope.$index"
                  :render="item.render"
                ></SlTableColFormat>
                <div v-else class="tableData-col-text">{{scope.row[item.prop] }}</div>
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
import SlTableColFormat from './SlTableColFormat'
export default {
  name: 'SlTable',
  components: {
    SlTableColFormat
  },
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
