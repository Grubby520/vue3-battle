<template>
  <div>
    <el-alert class="mb-16px" type="warning" :closable="false">
      注意！请打印发票和供货清单，每页加盖公司公章后扫描文件并上传每一页图片完成结算。
      <span>
        参照范本
        <el-button type="text" @click="downloadTemplate">查看</el-button>
      </span>
    </el-alert>
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
      <SlTableToolbar>
        <SlButton
          type="primary"
          boxShadow="primary"
          :loading="loading"
          :disabled="!canExport"
          @click="exportList"
        >导出</SlButton>
      </SlTableToolbar>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        v-model="selections"
        :tableData="tableData"
        :columns="columns"
        :selection="true"
        :operate="true"
        :tooltip="false"
        align="left"
        rowKey="paymentRequestId"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button class="operation-btn" type="text" @click="download(row,1)">下载Invoice</el-button>
          <el-button class="operation-btn" type="text" @click="download(row,3)">下载供货清单</el-button>
          <el-button
            class="operation-btn"
            type="text"
            @click="openAttachmentsManageDialog(row)"
          >{{attachmentsText(row)}}</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 附件 -->
    <AttachmentsManageDialog
      :title="attachmentsManageDialogTitle"
      :show.sync="attachmentsManageDialogShow"
      :data.sync="attachments"
      :fileType="3"
      :status="attachmentsManageStatus"
      data-key="associationId"
      @submitHandler="saveAttachments"
    ></AttachmentsManageDialog>
  </div>
</template>

<script>
import { exportFileFromRemote, date, thousandsSeparate, errorMessageTip, getSessionItem } from '@shared/util'
import CommonUrl from '@api/url.js'
import BillUrl from '@api/bill/billUrl.js'
import GoodsUrl from '@api/goods/goodsUrl.js'
import GoodsApi from '@api/goods'
import SettlementApi from '@api/settlement'
import AttachmentsManageDialog from '@/views/components/AttachmentsManageDialog.vue'

export default {
  name: 'BillList',
  components: {
    AttachmentsManageDialog
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      paymentRequestId: null,
      attachmentsManageDialogTitle: '上传附件',
      attachmentsManageDialogShow: false,
      attachmentsManageStatus: 'edit',
      attachments: [],
      tableData: [],
      selections: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      query: {},
      searchItems: [
        {
          type: 'input',
          label: '请款单号',
          name: 'paymentRequestNo'
        },
        {
          type: 'input',
          label: '结算单号',
          name: 'settlementOrderNo'
        },
        {
          type: 'single-select',
          label: '状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PAYMENT_REQUEST_STATUS_ENUM' }
          }
        },
        {
          type: 'date',
          label: '创建时间',
          name: 'createAts',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'paymentRequestNo',
          label: '请款单号',
          render: (h, data) => {
            let { row = {} } = data
            return <el-link type="primary" onClick={() => this.toDetail(row)}>{row.paymentRequestNo}</el-link>
          }
        },
        {
          prop: 'applyPaymentAmount',
          label: '请款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.applyPaymentAmount)}</span>
          }
        },
        {
          prop: 'settlementAmount',
          label: '结算总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.settlementAmount)}</span>
          }
        },
        {
          prop: 'supplyMoneyAmount',
          label: '补款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.supplyMoneyAmount)}</span>
          }
        },
        {
          prop: 'deductMoneyAmount',
          label: '扣款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return <span>{thousandsSeparate(row.deductMoneyAmount)}</span>
          }
        },
        {
          prop: 'statusName',
          label: '状态'
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
          prop: '',
          label: '时间',
          width: '250',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <div>
                {
                  row.requestPayoutAt && (<p>创建时间：{row.requestPayoutAt}</p>)
                }
                {
                  row.paymentTime && (<p>打款时间：{row.paymentTime}</p>)
                }
                {
                  row.payRejectAt && (<p>驳回时间：{row.payRejectAt}</p>)
                }
              </div>
            )
          }
        },
        {
          prop: 'attachmentNum',
          label: '附件数'
        }
      ]
    }
  },
  watch: {
  },
  computed: {
    canExport () {
      return this.selections.length > 0
    },
    attachmentsText () {
      return (row) => this.getAttachmentsText(row)
    }
  },
  methods: {
    getAttachmentsText (row) {
      let auditRecords = row.auditRecords || []
      let hasAuditResult = auditRecords.some(item => item.auditStatus === 'REJECT' || item.auditStatus === 'PASS')
      if (row.status === -1 || (row.status === 0 && !hasAuditResult)) {
        this.attachmentsManageStatus = 'edit'
        return '上传附件'
      }
      this.attachmentsManageStatus = 'view'
      return '查看附件'
    },
    downloadTemplate () {
      exportFileFromRemote({
        url: BillUrl.templateTar,
        name: '参考范本.rar',
        params: {},
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '下载中' })
        },
        afterLoad: () => {
          this.loading = false
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.tableLoading = true
      SettlementApi.getPaymentOrderList(params).then(res => {
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
      let { createAts = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        businessType: getSessionItem('supplierType') === 'OEM' ? 1 : 0,
        createAtStart: createAts && createAts[0] ? createAts[0] : '',
        createAtEnd: createAts && createAts[1] ? createAts[1] : ''
      }
    },
    toDetail (row) {
      this.$router.push({
        path: '/home/finance/bill-detail',
        query: {
          paymentRequestId: row.paymentRequestId,
          status: row.status
        }
      })
    },
    exportList () {
      exportFileFromRemote({
        url: GoodsUrl.exportReimbursementList,
        name: `请款单详情_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`,
        params: {
          reimbursementIds: this.selections.map(item => item.paymentRequestId)
        },
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
        },
        afterLoad: () => {
          this.loading = false
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => {
          errorMessageTip('导出失败,请重试')
        }
      })
    },
    download (row, type) {
      let fileName = ''
      let url = ''
      switch (type) {
        case 1:
          url = GoodsUrl.exportInvoice
          fileName = `发票_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`
          break
        case 3:
          url = GoodsUrl.exportSupplyList
          fileName = `供货清单_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`
          break
      }
      exportFileFromRemote({
        url: url + `/${row.paymentRequestId}`,
        name: fileName,
        params: {},
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '下载中' })
        },
        afterLoad: () => {
          this.loading = false
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => {
          errorMessageTip('下载失败,请重试')
        }
      })
    },
    openAttachmentsManageDialog (row) {
      this.getAttachmentList(row)
      this.paymentRequestId = row.paymentRequestId
      this.attachmentsManageDialogTitle = this.getAttachmentsText(row)
      this.attachmentsManageDialogShow = true
    },
    getAttachmentList (row) {
      GoodsApi.getAttachmentList({ associationId: row.paymentRequestId, associationType: '3' }).then(res => {
        let data = res.data || []
        this.attachments = data.map(item => {
          return {
            associationId: item.associationId,
            name: item.attachmentName,
            src: item.attachmentUrl
          }
        })
      })
    },
    saveAttachments () {
      const params = {
        paymentRequestId: this.paymentRequestId,
        attachmentInfoDtoList: this.attachments.map(item => {
          return {
            attachmentName: item.name,
            attachmentUrl: item.src
          }
        })
      }
      this.loading = true
      GoodsApi.updateReimbursementAttachments(params).then(res => {
        if (res.success) {
          this.attachmentsManageDialogShow = false
          this.$message.success('保存成功')
          this.gotoPage()
        } else {
          errorMessageTip(res.error && res.error.message)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.operation-btn {
  margin-left: 0 !important;
  margin-right: 0.8rem;
}
</style>
