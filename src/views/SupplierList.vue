<template>
  <div>
    <SlListView
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      ref="listView"
    >
      <div slot="search">
        <SlSearchForm v-model="query" :items="searchItems" ref="searchForm"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button
          type="primary"
          :disabled="selections.length === 0"
          @click="freezeOrActive(selections,'freeze')"
        >冻结</el-button>
        <el-button
          type="primary"
          :disabled="selections.length === 0"
          @click="freezeOrActive(selections,'active')"
        >取消冻结</el-button>
      </SlTableToolbar>
      <SlTable ref="table" :tableData="tableData" :columns="columns" v-model="selections">
        <div slot="operation" slot-scope="{row}">
          <el-button v-if="row.status === 0" @click="access(row)" type="text">准入</el-button>
          <el-button v-if="row.status === 1" @click="showAuditDialog(row)" type="text">审核</el-button>
          <el-button v-if="row.status === 3" @click="freezeOrActive(row,'active')" type="text">取消冻结</el-button>
          <el-button v-if="row.status === 4" @click="freezeOrActive(row,'freeze')" type="text">冻结</el-button>
          <el-button @click="resetPassword(row)" type="text">重置密码</el-button>
        </div>
      </SlTable>
    </SlListView>
    <!-- 审核 -->
    <el-dialog title="供应商注册审核" :visible.sync="auditDialogVisible" :center="true" width="300px">
      <div class="align-center">
        <el-radio-group v-model="auditStatus" size="medium">
          <el-radio :label="0">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          :disabled="!auditStatus"
          @click="doAudit"
          :loading="isLoading"
        >{{$t('button.enterText')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { confirmBox, successNotify } from '@shared/util'
import SupplierUrl from '@api/supplier/supplierUrl'
import SupplierApi from '@api/supplier'
const { mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'SupplierList',
  data () {
    return {
      searchItems: [
        {
          type: 'input',
          name: 'supplierName',
          label: '供应商'
        },
        {
          type: 'input',
          name: 'accountName',
          label: '账号'
        },
        {
          type: 'single-select',
          name: 'status',
          label: '供应商状态',
          data: {
            isBlock: true,
            remoteUrl: SupplierUrl.statusList,
            options: []
          }
        }
      ],
      query: {},
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      selections: [],
      columns: [
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'erpSupplierId',
          label: '供应商编号'
        },
        {
          prop: 'accountName',
          label: '账号'
        },
        {
          prop: 'statusValue',
          label: '供应商状态'
        },
        {
          prop: 'contactName',
          label: '联系人'
        },
        {
          prop: 'contactNumber',
          label: '联系电话'
        },
        {
          prop: 'addressDetail',
          label: '公司地址'
        },
        {
          prop: 'supplyTypeValue',
          label: '供应类型'
        },
        {
          prop: 'supplyWayValue',
          label: '供应方式'
        }
      ],
      auditDialogVisible: false,
      auditStatus: null,
      auditRow: null,
      isLoading: false
    }
  },

  methods: {
    ...userMapActions(['RESET_PASSWORD']),
    gotoPage (pageSize = 10, pageIndex = 1) {
      SupplierApi.getList({
        ...this.query,
        pageNum: pageIndex,
        pageSize: pageSize
      }).then((res) => {
        let { data, success } = res
        if (success) {
          this.page.total = data.total
          this.tableData = data.list
        }
      })
    },
    reset () {
      this.$refs.searchForm.reset()
      this.gotoPage(10, 1)
    },
    // 准入
    access ({ id, supplierName }) {
      confirmBox(this, `供应商${supplierName}准入后，可以正式接单`).then(() => {
        SupplierApi.access({
          id,
          status: 4
        }).then((res) => {
          if (res.success) {
            this.gotoPage(10, 1)
            successNotify(this, `供应商${supplierName}准入成功`)
          }
        })
      }).catch(() => { })
    },
    showAuditDialog (row) {
      this.auditRow = row
      this.auditDialogVisible = true
    },
    // 审核
    doAudit () {
      this.isLoading = true
      SupplierApi.audit({
        id: this.auditRow.id,
        status: this.auditStatus
      }).then((res) => {
        if (res.success) {
          this.gotoPage(10, 1)
          this.auditDialogVisible = false
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    // 冻结、取消冻结
    freezeOrActive (data, type) {
      let status
      let params = []
      if (type === 'freeze') {
        status = 3
      }

      if (type === 'active') {
        status = 4
      }

      if (Array.isArray(data)) {
        params = data.filter(item => {
          return type === 'freeze' ? item.status === 3 : item.status === 4
        }).map(ele => {
          return {
            status,
            id: ele.id
          }
        })
      } else {
        params = [{ id: data.id, status }]
      }

      confirmBox(this, '冻结后，供应商账户将不可用，是否冻结?').then(() => {
        SupplierApi.frozenOrActive(params).then(res => {
          if (res.success) {
            successNotify(this, '操作成功')
            this.gotoPage(10, 1)
          }
        })
      }).catch(() => { })
    },
    resetPassword (row) {
      confirmBox(this, '确定要重置该用户密码?').then(() => {
        this.RESET_PASSWORD({
          supplierId: row.id
        }).then(res => {
          if (res) {
            successNotify(this, `密码重置成功!<p>新密码：${res.data}</p>`, true, 0)
          }
        })
      }).catch(() => { })
    }
  },
  beforeDestroy () {
    this.auditRow = null
  }
}
</script>

<style lang="scss" scoped>
</style>
