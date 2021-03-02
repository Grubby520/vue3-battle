<template>
  <div>
    <el-alert class="mb-2rem" type="warning" :closable="false">
      注意！请打印发票和供货清单，每页加盖公司公章后扫描文件并上传每一页图片完成结算。
      <span>
        参照范本
        <el-button type="text" @click="downloadTemplate">查看</el-button>
      </span>
    </el-alert>
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
      <SlTableToolbar>
        <el-button type="primary" :loading="loading" :disabled="!canExport" @click="exportDetail">导出</el-button>
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
      >
        <div slot="operation" slot-scope="{row}">
          <el-button type="text" @click="download(row,1)">下载Invoice</el-button>
          <el-button type="text" @click="download(row,2)">下载请款单</el-button>
          <el-button type="text" @click="download(row,3)">下载供货清单</el-button>
          <el-button type="text" @click="openAttachmentsManageDialog(row)">上传附件</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 附件 -->
    <AttachmentsManageDialog
      :show.sync="attachmentsManageDialogShow"
      :data.sync="attachments"
      :fileType="3"
      :status="attachmentsManageStatus"
      @submitHandler="saveAttachments"
      @deleteHandler="deleteAttachments"
    >
      <el-button
        :loading="loading"
        type="primary"
        @click="saveAttachments"
      >{{$t('button.saveText')}}</el-button>
    </AttachmentsManageDialog>
  </div>
</template>

<script>
import { exportFileFromRemote, date, thousandsSeparate, downloadFile } from '@shared/util'
import CommonUrl from '@api/url.js'
import BillUrl from '@api/bill/billUrl.js'
import CommonApi from '@api/api'
import GoodsApi from '@api/goods'
import AttachmentsManageDialog from '@/views/components/AttachmentsManageDialog.vue'

export default {
  name: 'BillList',
  components: {
    AttachmentsManageDialog
  },
  data () {
    return {
      loading: false,
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
          label: '报账单号',
          name: 'reimbursementNo'
        },
        {
          type: 'single-select',
          label: '状态',
          name: 'status',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_STATE' }
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
          prop: 'reimbursementNo',
          label: '报账单号',
          render: (h, data) => {
            let { row = {} } = data
            return <el-link type="primary" onClick={() => this.toDetail(row)}>{row.reimbursementNo}00000</el-link>
          }
        },
        {
          prop: 'reimbursementAmount',
          label: '报账总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.reimbursementAmount)
          }
        },
        {
          prop: 'settlementAmount',
          label: '结算总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplierAmount)
          }
        },
        {
          prop: 'supplyMoneyAmount',
          label: '补款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.supplyMoneyAmount)
          }
        },
        {
          prop: 'deductMoneyAmount',
          label: '扣款总金额(￥)',
          width: '120',
          render: (h, data) => {
            let { row = {} } = data
            return thousandsSeparate(row.deductMoneyAmount)
          }
        },
        {
          prop: 'status',
          label: '状态'
        },
        {
          prop: 'remarks',
          label: '备注',
          width: '100'
        },
        {
          prop: '',
          label: '时间',
          width: '250'
        },
        {
          prop: 'attachmentNum',
          label: '附件数'
        }
      ]
    }
  },
  computed: {
    canExport () {
      return this.selections.length > 0
    }
  },
  mounted () {

  },
  methods: {
    downloadTemplate () {
      downloadFile(BillUrl.templateTar)
    },
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getPurchaseTableList(params).then(res => {
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
      this.resetParams()
      this.$refs.listView.refresh()
    },
    resetParams () {
      this.$refs.searchForm.reset()
    },
    generateParams (pageSize, pageIndex) {
      // let { paymentAts = [], ...orther } = this.query
      let { cTimes = [], uTimes = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        cStartTime: cTimes && cTimes[0] ? cTimes[0] : '',
        cEndTime: cTimes && cTimes[1] ? cTimes[1] : '',
        uStartTime: uTimes && uTimes[0] ? uTimes[0] : '',
        uEndTime: uTimes && uTimes[1] ? uTimes[1] : ''
      }
    },
    toDetail (row) {
      this.$router.push({
        path: '/home/finance/bill-detail',
        query: {
          reimbursementNo: '123456789'
        }
      })
    },
    exportDetail () {
      exportFileFromRemote({
        url: 'url',
        name: 'fileName',
        params: {},
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING', { isCount: false, loadingText: '导出中' })
        },
        afterLoad: () => {
          this.loading = false
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    },
    download (row, type) {
      let fileName = ''
      let url = ''
      switch (type) {
        case 1:
          fileName = `invoice_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`
          break
        case 2:
          fileName = `请款单_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`
          break
        case 3:
          fileName = `供货清单_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`
          break
      }
      exportFileFromRemote({
        url: url,
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
        errorFn: () => { }
      })
    },
    openAttachmentsManageDialog (row) {
      this.getAttachmentList(row)
      this.attachmentsManageDialogShow = true
    },
    getAttachmentList (row) {
      CommonApi.getAttachmentList({ associationId: row.associationId, associationType: row.associationType }).then(res => {
        this.attachments = res.data || []
      })
    },
    saveAttachments () {
      this.loading = true
      CommonApi.saveAttachmentRelation(this.attachments.map(item => {
        return {
          associationId: item.associationId,
          associationType: item.associationType,
          attachmentName: item.attachmentName,
          attachmentUrl: item.src
        }
      })).then(res => {
        if (res.success) {
          this.$message.success('保存成功')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    deleteAttachments (file) {
      CommonApi.deleteAttachment({ id: file.id }).then(res => {
        if (res.success) {
          this.attachments = this.attachments.filter(item => item.name !== file.name)
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
