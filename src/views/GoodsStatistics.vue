<template>
  <div class="goods-statistics">
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
      :pageSizes="pageSizes"
    >
      <div slot="search">
        <SlSearchForm ref="searchForm" v-model="searchQuery" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <el-table
        :data="tableData"
        border
        size="mini"
        sortable="custom"
        default-expand-all
        @sort-change="sortChange"
      >
        <el-table-column type="expand" width="25px">
          <template slot-scope="props">
            <div class="expand-table">
              <table style="width:100%">
                <tbody>
                  <tr
                    class="border-bottom--gray"
                    v-for="(item,index) in props.row.productDashboardSkuInfos"
                    :key="'sku_'+index"
                  >
                    <td width="425px">
                      <div class="flex-center">
                        <div class="flex2 align-left mr-1rem">
                          <p>SKU:{{item.skuCode}}</p>
                          <p>商家商品编码:{{item.supplierSkuCode}}</p>
                        </div>
                        <div class="flex1 align-left">
                          <p>商家吊牌尺码:{{item.tagSize}}</p>
                          <p>销售尺码:{{item.saleSize}}</p>
                        </div>
                      </div>
                    </td>
                    <td class="align-center">{{item.total7days}}</td>
                    <td class="align-center" width="200px">{{item.total15days}}</td>
                    <td class="align-center" width="200px">{{item.total30days}}</td>
                    <td class="align-center" width="200px">{{item.inventoryQuantity}}</td>
                    <td class="align-center" width="200px">{{item.intransitQuantity}}</td>
                    <td class="align-center" width="200px">{{item.orderedUndeliveredQuantity}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop label="商品信息" width="400px" align="center">
          <template slot="header" slot-scope="scope">
            {{scope.column.label}}
            <el-tag
              v-show="headerSearchQuery.color"
              class="mr-1rem"
              size="mini"
              closable
              @close="clearChoosedColor"
            >{{choosedColor}}</el-tag>
            <el-button type="text">
              <span
                class="el-icon-search align-middle cursor-pointer font-wight-600 ml"
                @click="openColorFilterDialog"
              ></span>
            </el-button>
          </template>
          <template slot-scope="scope">
            <div class="flex-center">
              <div class="flex1">
                <SlImage size="5rem" :src="scope.row.productImage" />
              </div>
              <div class="flex1 align-left">
                <p>SPU:{{scope.row.spuCode}}</p>
                <p>颜色:{{scope.row.color}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total7days" label="近7天销量" align="center" sortable></el-table-column>
        <el-table-column prop="total15days" label="近15天销量" width="200px" align="center" sortable></el-table-column>
        <el-table-column prop="total30days" label="近30天销量" width="200px" align="center" sortable></el-table-column>
        <el-table-column
          prop="inventoryQuantity"
          label="库存数量"
          width="200px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column prop="intransitQuantity" label="在途数量" width="200px" align="center"></el-table-column>
        <el-table-column
          prop="orderedUndeliveredQuantity"
          label="已下单未发货数量"
          width="200px"
          align="center"
        ></el-table-column>
      </el-table>
    </SlListView>
    <!-- 按颜色筛选对话框 -->
    <el-dialog
      title="颜色筛选"
      :visible.sync="colorFilterDialogVisible"
      width="300px"
      @close="colorFilterDialogClose"
    >
      <el-form>
        <el-form-item label="颜色">
          <el-select v-model="filterColorValue" filterable clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in colorOptions"
              :key="'options-'+index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colorFilterDialogVisible = false">{{$t('button.cancelText')}}</el-button>
        <el-button type="primary" @click="filterByColor">{{$t('button.enterText')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ORDER_MAP } from '@shared/const'
import { noSymbolValue } from '@api/static/index'
import GoodsApi from '@api/goods'

export default {
  name: 'GoodsStatistics',
  data () {
    return {
      colorFilterDialogVisible: false,
      filterColorValue: null,
      pageSizes: [10],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      searchQuery: {},
      headerSearchQuery: {
        color: null,
        orderBy: null,
        orderDirect: null
      },
      colorOptions: [],
      searchItems: [
        {
          type: 'input',
          label: '商家商品编码',
          name: 'supplierSkuCode'
        },
        {
          type: 'input',
          label: 'SPU编码',
          name: 'spuCode'
        },
        {
          type: 'input',
          label: 'SKU编码',
          name: 'skuCode'
        }
      ],
      tableData: []
    }
  },
  computed: {
    choosedColor () {
      // 如果选择'无'则显示'无颜色属性值'
      if (this.headerSearchQuery.color === noSymbolValue) {
        return '无颜色属性值'
      }
      let choosedItem = this.colorOptions.find(item => item.value === this.headerSearchQuery.color)
      return choosedItem ? choosedItem.label : null
    }
  },
  created () {
    this.getColorOptions()
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      let params = this.getParams(pageSize, pageIndex)
      GoodsApi.getProductDashboardList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
        }
      }).finally(() => {
        this.$refs.listView.loading = false
      })
    },
    reset () {
      this.headerSearchQuery = {
        color: null,
        orderBy: null,
        orderDirect: null
      }
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },
    sortChange (sortParams) {
      let orderBy = null
      let orderDirect = null
      const propsMap = {
        'total7days': 'total_7days',
        'total15days': 'total_15days',
        'total30days': 'total_30days',
        'inventoryQuantity': 'inventory_quantity'
      }
      if (sortParams.order) {
        orderBy = propsMap[sortParams.prop]
        orderDirect = ORDER_MAP[sortParams.order]
      }

      this.headerSearchQuery.orderBy = orderBy
      this.headerSearchQuery.orderDirect = orderDirect
      this.gotoPage()
    },
    filterByColor () {
      this.headerSearchQuery.color = this.filterColorValue
      this.colorFilterDialogVisible = false
      this.gotoPage()
    },
    clearChoosedColor () {
      this.headerSearchQuery.color = this.filterColorValue = null
      this.gotoPage()
    },
    openColorFilterDialog () {
      this.getColorOptions()
      this.colorFilterDialogVisible = true
    },
    colorFilterDialogClose () {
      this.filterColorValue = null
    },
    getParams (pageSize, pageIndex) {
      let params
      // 处理color值,区分'无'和'全部'两种情况,后端分别用''和null表示,所以在此特殊处理
      let color = this.headerSearchQuery.color === noSymbolValue ? '' : this.headerSearchQuery.color === '' ? null : this.headerSearchQuery.color
      params = Object.assign({ pageSize, pageIndex }, this.searchQuery, {
        ...this.headerSearchQuery,
        color
      })
      return params
    },
    getColorOptions () {
      GoodsApi.getProductColors(this.searchQuery).then(res => {
        this.colorOptions = res.data || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$tdBgColor: #ecf0f5;

.goods-statistics /deep/ {
  .el-dialog__footer {
    text-align: center;
  }

  .expand-table {
    padding: 0.5em;
    tr {
      &:last-child {
        border-bottom: none;
      }
      &:hover > td {
        background-color: $tdBgColor;
      }
    }
    td {
      padding: 0 1rem;
      line-height: 2.5rem;
      border: none;
      background-color: $tdBgColor;
    }
  }

  .el-table__expand-column {
    border-right: 0;
  }

  .el-table__expanded-cell {
    padding: 0;
  }
}
</style>
