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
  name: 'DefectiveList',
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
          type: 'input',
          label: '发货单号',
          name: 'deliveryNumber'
        },
        {
          type: 'input',
          label: '物流单号',
          name: 'logisticsNumber'
        },
        {
          type: 'input',
          label: 'SKU',
          name: 'sku'
        },
        {
          type: 'single-select',
          label: '异常类型',
          name: 'exceptionType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'DEFECTIVE_EXCEPTION_ENUM' }
          }
        },
        {
          type: 'single-select',
          label: '异常处理方式',
          name: 'exceptionDealType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'DEFECTIVE_EXCEPTION_DEAL_ENUM' }
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
            supplierItemNo: '供方货号',
            supplierSkuCode: '商家SKU',
            skuCode: 'SKU'
          },
          data: {
            imgSize: '5rem'
          }
        },
        {
          prop: 'name',
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
          prop: 'exceptionTypeName',
          label: '异常类型'
        },
        {
          prop: 'exceptionAmount',
          label: '异常数量'
        },
        {
          prop: 'exceptionDealTypeName',
          label: '处理方式'
        },
        {
          prop: 'remark',
          label: '详情'
        },
        {
          prop: 'purchaseOrderNum',
          label: '采购单号'
        },
        {
          prop: 'orderNumber',
          label: '发货单号'
        },
        {
          prop: '',
          label: '物流单号',
          width: '150',
          pre: {
            oldLogisticsNumber: '发货物流',
            logisticsNumber: '退货物流'
          }
        },
        {
          prop: 'operateName',
          label: '采购员'
        },
        {
          prop: '',
          label: '时间',
          width: '200',
          pre: {
            createTime: '创建时间',
            updateTime: '更新时间'
          }
        }
      ]
    }
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = { ...this.query, pageIndex, pageSize }
      GoodsApi.getDefectiveTableList(params).then(res => {
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
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
