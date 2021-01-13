<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
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
      ></SlTable>
    </SlListView>
  </div>
</template>

<script>
import { date } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsApi from '@api/goods'

export default {
  name: 'DefectiveList',
  data () {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
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
          name: 'logisticsNo'
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
          prop: 'name',
          label: '商品名称'
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: 'exceptionType',
          label: '异常类型'
        },
        {
          prop: 'exceptionAmount',
          label: '异常数量'
        },
        {
          prop: 'exceptionDealType',
          label: '处理方式'
        },
        {
          prop: 'remark',
          label: '详情'
        },
        {
          prop: 'purchaseOrderId',
          label: '采购单号'
        },
        {
          prop: 'orderNumber',
          label: '发货单号'
        },
        {
          prop: 'logisticsNumber',
          label: '物流单号'
        },
        {
          prop: 'operateName',
          label: '采购员'
        },
        {
          prop: '',
          label: '时间',
          width: '200',
          render: function (h, data) {
            let { row = {} } = data
            let cTimeArr = [
              {
                timeStamp: row.createTime,
                typeDes: '创建时间'
              },
              {
                timeStamp: row.updateTime,
                typeDes: '更新时间'
              }
            ]
            return (
              cTimeArr.map(item => {
                if (!item.timeStamp) return ''
                return (
                  <div>
                    <span>{item.typeDes}:</span>
                    <span>{date(item.timeStamp, 'yyyy-MM-dd hh:mm:ss')}</span>
                  </div>
                )
              })
            )
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
