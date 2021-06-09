<template>
  <div class="sl-table-wrap">
    <el-table
      class="sl-table-theme"
      :data="tableData"
      v-bind="$attrs"
      v-on="$listeners"
      style="width: 100%"
      header-row-class-name="table-header--custom"
      row-class-name="table-row--custom"
      ref="tableInfo"
    >
      <el-table-column type="index" align="center" width="50" v-if="showIndex"></el-table-column>
      <el-table-column
        type="selection"
        align="center"
        width="55"
        v-if="multiple"
        :selectable="checkSelectable"
      ></el-table-column>
      <el-table-column type="expand" v-if="expand">
        <template v-slot="{row}">
          <slot name="expand" :row="row"></slot>
        </template>
      </el-table-column>
      <template v-for="col in columns">
        <el-table-column
          :label="col.label"
          :key="col.name"
          :align="col.align ?col.align :align "
          :header-align="headerAlign"
          :width="col.width"
          :class-name="col.className"
        >
          <template slot="header">
            <slot :name="col.name + `-header`"></slot>
          </template>
          <template slot-scope="scope">
            <slot :name="col.name" :row="scope.row">
              <ShowImage :src="scope.row[col.name]" v-if="col.isImage" :params="col.imagesParams" />
              <a
                :href="scope.row[col.linkUrl]"
                v-else-if="col.isLink"
                target="_blank"
                class="link"
              >{{scope.row[col.name]}}</a>
              <span v-else>{{ showNormalInfo(scope.row[col.name]) }}</span>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import ShowImage from './SlImage'
import { isEmpty } from '@shared/util'
export default {
  name: 'SlTableInfo',
  components: { ShowImage },
  props: {
    columns: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'left'
    },
    headerAlign: {
      type: String,
      default: 'center'
    },
    params: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    disabledKeys: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }, // 禁址选中的行标识数据
    rowKey: {
      type: String,
      required: false,
      default: 'id'
    }
  },
  data () {
    return {}
  },
  methods: {
    clearSelection () {
      this.$refs.tableInfo.clearSelection()
    },
    showNormalInfo (data) {
      return isEmpty(data) ? '-' : data
    },
    checkSelectable (row) {
      return this.disabledKeys.indexOf(row[this.rowKey]) === -1
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.align-top {
  vertical-align: top;
}
/deep/.vertical-operation {
  .cell {
    display: flex;
    flex-flow: column;
    button {
      margin-left: 0;
      margin-bottom: 10px;
    }
  }
}
.link {
  text-decoration: underline;
  text-decoration-color: grey;
  display: inline-block;
  max-width: 200px;
  &:hover {
    color: red;
  }
}
</style>
