<template>
  <div class="sl-card-table">
    <div
      class="table-content"
      v-for="(item,index) in tableData"
      :class="{'sl-table-wrap':addWrapClass}"
      :key="item[primaryKey]+'&'+index"
    >
      <div class="table-content-header color-bg--white">
        <el-checkbox
          v-if="selectable"
          class="mr-16px"
          :true-label="'add_'+item[primaryKey]"
          :false-label="'delete_'+item[primaryKey]"
          @change="selectHandler"
        ></el-checkbox>
        <slot name="header" :row="item">
          <ul v-if="columns.length > 0" class="default-header-content">
            <li class="mr-24px" v-for="propItem in columns" :key="propItem.prop">
              <span class="header-prop-label mr-8px">{{propItem.label}}:</span>
              <span class="header-prop-value">{{item[propItem.prop]}}</span>
            </li>
          </ul>
        </slot>
      </div>
      <div class="table-content-body">
        <slot name="body" :row="item">
          <el-table
            class="sl-table-theme"
            :data="item[childName]"
            header-row-class-name="table-header--custom"
            row-class-name="table-row--custom"
          >
            <template v-for="(col,index) in childColumns">
              <el-table-column
                align="left"
                header-align="left"
                :key="col.prop+index"
                :label="col.label"
                :width="col.width"
              >
                <template slot="header">
                  <slot :name="col.prop + `-header`"></slot>
                </template>
                <template slot-scope="scope">
                  <slot :name="col.prop" :row="scope.row">
                    <SlImage
                      v-if="col.isImg"
                      :src="scope.row[col.prop]"
                      :size="col.data && col.data.imgSize"
                    />
                    <span v-else>{{ dataFormat(scope.row[col.prop]) }}</span>
                  </slot>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </slot>
      </div>
    </div>
    <div v-if="tableData.length === 0" class="sl-card-table--nodata">暂无数据</div>
  </div>
</template>
<script>
import { isEmpty } from '@shared/util'

export default {
  name: 'SlCardTable',
  props: {
    addWrapClass: {
      type: Boolean,
      default: true
    },
    childName: {
      type: String,
      default: ''
    },
    childColumns: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selections: {
      type: Array,
      default: () => []
    },
    primaryKey: {
      type: String,
      default: 'id'
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableData: [],
      selectedRows: []
    }
  },
  watch: {
    data (val) {
      this.tableData = val.map(item => {
        let temp = {
          ...item
        }
        let selectRow = this.selectedRows.find(checkedItem => checkedItem[this.primaryKey] === item[this.primaryKey])

        if (this.selectable) {
          temp['_rowChecked'] = (selectRow && selectRow['_rowChecked']) || false
        }
        return temp
      })
    },
    selections (val) {
      this.selectedRows = JSON.parse(JSON.stringify(val))
    }
  },
  mounted () {

  },
  methods: {
    selectHandler (value) {
      let values = value.split('_')
      let operation = values && values[0] // add or delete
      let primaryKey = values && values[1]
      if (operation === 'add') {
        let row = this.tableData.find(item => this.isSameRow(item, primaryKey))
        row && this.selectedRows.push(row)
      } else {
        let findIndex = this.tableData.findIndex(item => this.isSameRow(item, primaryKey))
        this.selectedRows.splice(findIndex, 1)
      }
      this.$emit('update:selections', this.selectedRows)
    },
    isSameRow (item, primaryKey) {
      return String(primaryKey) === String(item[this.primaryKey])
    },
    dataFormat (data) {
      return isEmpty(data) ? '-' : data
    }
  }
}
</script>
<style lang="scss">
@import '@assets/scss/_var.scss';
.sl-card-table {
  .table-content {
    margin-bottom: 1.4rem;
  }

  .table-content-header {
    padding-top: 1.6rem;
    padding-bottom: 1.4rem;
  }

  .default-header-content {
    display: inline-block;
    li {
      display: inline-block;
      .header-prop-label {
        color: $color-text-primary;
      }

      .header-prop-value {
        color: $color-text-minor;
      }
    }
  }

  .sl-card-table--nodata {
    line-height: 5.6rem;
    text-align: center;
    color: $color-text-minor;
    background-color: $color-white;
  }
}
</style>
