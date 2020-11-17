<template>
  <el-table
    :data="tableData"
    class="tableData"
    @selection-change="handleSelectionChange"
    :border="border"
    size="mini"
  >
    <el-table-column v-if="selection" type="selection" width="55" fixed />
    <div v-for="item in columns" :key="item.label">
      <template v-if="item.isImg">
        <el-table-column align="center" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover" v-if="popver">
              <div>
                <el-image
                  class="tableData-popover"
                  :src="scope.row[item.prop]"
                  fit="contain"
                  slot="reference"
                />
              </div>

              <el-image
                class="tableData-image"
                :src="scope.row[item.prop]"
                fit="contain"
                slot="reference"
              />
            </el-popover>
            <div v-else>
              <el-image
                class="tableData-image"
                :src="scope.row[item.prop]"
                fit="contain"
                slot="reference"
              />
            </div>
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
                <img :src="scope.row[item.isInImg]" class="tableData-col-img" />
              </el-col>

              <el-col :span="item.isInImg?14:24">
                <div v-if="item.pre" :class="{'tableData-col-pre' : !item.isInImg && item.pre }">
                  <div class="tableData-col-con">
                    <div v-for="(pr, ins) in item.pre" :key="pr">
                      <span>{{ pr }}:</span>
                      <span>{{ scope.row[ins] }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="tableData-col-text">{{ scope.row[item.prop] }}</div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
    </div>
    <el-table-column width="180px" align="center" label="操作">
      <template slot-scope="scope">
        <slot name="opration" :row="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'SlBaseTable',
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
    popver: { type: Boolean, required: false, default: false },
    tooltip: { type: Boolean, required: false, default: false }
  },
  data () {
    return {}
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>
<style lang="scss">
.tableData {
  &-col {
    &-img {
      width: 100px;
      height: 100px;
      margin-right: 10px;
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
  &-popover {
    width: 320px;
    height: 320px;
  }
  &-image {
    width: 100px;
    height: 100px;
  }
  /deep/ .cell {
    text-align: center;
  }
}
</style>
