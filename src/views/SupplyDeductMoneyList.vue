<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm
          ref="searchForm"
          v-model="query"
          :items="searchItems"
          :loading="tableLoading"
          @reset="gotoPage(page.pageSize)"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>
      </div>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        :selection="false"
        :operate="true"
        :tooltip="false"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="openAttachmentsManageDialog(row)">查看附件</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 附件 -->
    <AttachmentsManageDialog
      title="查看附件"
      :show.sync="attachmentsManageDialogShow"
      :data.sync="attachments"
      :status="attachmentsManageStatus"
      :fileType="5"
      data-key="associationId"
    ></AttachmentsManageDialog>
  </div>
</template>

<script>
import { thousandsSeparate } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsApi from '@api/goods'
import AttachmentsManageDialog from '@/views/components/AttachmentsManageDialog.vue'

export default {
  name: 'SupplyDeductMoneyList',
  components: {
    AttachmentsManageDialog
  },
  data () {
    return {
      tableLoading: false,
      loading: false,
      attachmentsManageDialogShow: false,
      attachmentsManageStatus: 'view',
      attachments: [],
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
          label: '补扣款单号',
          name: 'supplementaryDeductionNo'
        },
        {
          type: 'single-select',
          label: '款项类型',
          name: 'paymentType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'REPLENISHMENT_DEDUCTED_PAYMENT_TYPE_ENUM' }
          }
        },
        {
          type: 'input',
          label: '源单编号',
          name: 'sourceOrderNo'
        },
        {
          type: 'single-select',
          label: '单据状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'REPLENISHMENT_DEDUCTED_STATUS_ENUM' }
          }
        }
      ],
      columns: [
        {
          prop: 'supplementaryDeductionNo',
          label: '补扣款单号'
        },
        {
          prop: 'paymentTypeName',
          label: '款项类型'
        },
        {
          prop: 'sourceOrderTypeName',
          label: '源单类型'
        },
        {
          prop: 'sourceOrderNo',
          label: '源单编号'
        },
        {
          prop: 'amount',
          label: '总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.amount)}</span>
          }
        },
        {
          prop: 'statusName',
          label: '单据状态'
        },
        {
          prop: 'settlementOrderNo',
          label: '关联结算单',
          width: '90'
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          width: '150'
        },
        {
          prop: 'rejectReason',
          label: '驳回原因',
          width: '200',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:200px">{row.rejectReason}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.rejectReason}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'auditAt',
          label: '审核通过时间/驳回时间',
          width: '150'
        },
        {
          prop: 'remarks',
          label: '备注',
          width: '200',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip placement="top" effect="light">
                <div slot="content" style="max-width:200px">{row.remarks}</div>
                <p v-slClamp={{ clamp: 2 }}>{row.remarks}</p>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'attachmentAmount',
          label: '附件数'
        }
      ]
    }
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      GoodsApi.getSupplyDeductionList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    generateParams (pageSize, pageIndex) {
      return {
        ...this.query,
        pageIndex,
        pageSize
      }
    },
    openAttachmentsManageDialog (row) {
      this.getAttachmentList(row)
      this.attachmentsManageDialogShow = true
    },
    getAttachmentList (row) {
      GoodsApi.getAttachmentList({ associationId: row.id, associationType: '5' }).then(res => {
        let data = res.data || []
        this.attachments = data.map(item => {
          return {
            associationId: item.associationId,
            name: item.attachmentName,
            src: item.attachmentUrl
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
