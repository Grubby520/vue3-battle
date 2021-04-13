<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        :selection="false"
        :operate="false"
        :tooltip="false"
        rowKey="id"
      ></SlTable>
    </SlListView>
  </div>
</template>

<script>
import CommonUrl from '@api/url.js'
import GoodsApi from '@api/goods'

export default {
  name: 'LessGoodsList',
  data () {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'prepend-input',
          label: '请输入',
          name: 'sku',
          prepend: {
            type: 'select',
            value: 'skuCode',
            options: [
              { label: 'SKU', value: 'skuCode' },
              { label: '商家SKU', value: 'supplierSkuCode' }
            ]
          }
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'productName'
        },
        {
          type: 'single-select',
          label: '缺货类型',
          name: 'type',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'STOCK_OUT_TYPE_ENUM' }
          }
        },
        {
          type: 'input',
          label: '采购单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'single-select',
          label: '审核状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'STOCK_OUT_STATUS_ENUM' }
          }
        },
        {
          type: 'date',
          label: '创建时间',
          name: 'createdAts',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: '',
          label: '基本信息',
          width: '200',
          isInImg: 'imageUrl',
          pre: {
            skuCode: 'SKU',
            supplierSkuCode: '商家SKU'
          },
          data: {
            imgSize: '5rem'
          }
        },
        {
          prop: 'productName',
          label: '商品名称',
          width: '225',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:300px">{row.name}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.name}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: 'typeName',
          label: '缺货类型'
        },
        {
          prop: 'purchaseOrderQty',
          label: '订单数量'
        },
        {
          prop: 'applicationQty',
          label: '缺货数量'
        },
        {
          prop: 'purchaseOrderNumber',
          label: '采购单号'
        },
        {
          prop: 'applyRemarks',
          label: '备注',
          width: '225',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:300px">{row.applyRemarks}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.applyRemarks}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'statusName',
          label: '审核状态'
        },
        {
          prop: 'auditRemarks',
          label: '审核意见',
          width: '225',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:300px">{row.auditRemarks}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.auditRemarks}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          width: '150'
        }
      ]
    }
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)

      GoodsApi.getStockOutList(params).then(res => {
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
    generateParams (pageSize, pageIndex) {
      // eslint-disable-next-line camelcase
      let { createdAts = [], sku, sku_prepend, ...orther } = this.query

      return {
        ...orther,
        pageIndex,
        pageSize,
        [sku_prepend]: sku,
        createdStartAt: createdAts && createdAts[0] ? createdAts[0] : '',
        createdEndAt: createdAts && createdAts[1] ? createdAts[1] : ''
      }
    },
    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
