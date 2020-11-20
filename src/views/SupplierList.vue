<template>
  <div>
    <SlBaseListView
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
      ref="listView"
    >
      <div slot="search">
        <SlSearchForm v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button type="primary">冻结</el-button>
        <el-button type="primary">取消冻结</el-button>
      </SlTableToolbar>
      <SlTable
        ref="table"
        :tableData="tableData"
        :columns="columns"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="operation" slot-scope="{row}">
          <el-button @click="showAuditDialog(row)" type="text">审核</el-button>
          <el-button @click="freeze(row)" type="text">冻结/取消冻结</el-button>
          <el-button @click="access(row)" type="text">准入</el-button>
          <el-button @click="resetPassword(row)" type="text">重置密码</el-button>
        </div>
      </SlTable>
    </SlBaseListView>
    <!-- 审核 -->
    <el-dialog title="供应商注册审核" :visible.sync="auditDialogVisible" :center="true" width="300px">
      <div class="align-center">
        <el-radio-group v-model="auditStatus" size="medium">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">不通过</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="doAudit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { confirmBox, successNotify } from '@shared/util'

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
          type: 'select',
          name: 'status',
          label: '供应商状态',
          data: {
            options: [
              {
                label: '供应商状态',
                value: '1'
              }
            ]
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
          prop: 'status',
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
          prop: 'supplyType',
          label: '供应类型'
        },
        {
          prop: 'supplyWay',
          label: '供应方式'
        }
      ],
      auditDialogVisible: false,
      auditStatus: null
    }
  },

  methods: {
    gotoPage (pageSize, pageIndex) {
      console.log({
        ...this.query
      })
      this.tableData = [
        {
          supplierName: '供应商名称'
        }
      ]
    },
    reset () { },
    handleSelectionChange (val) {
      this.selections = val
      console.log(val)
    },
    access () {
      confirmBox(this, '供应商【广州十三行服装有限公司】准入后，可以正式接单').then(() => {
        successNotify(this, '供应商【广州十三行服装有限公司】准入成功')
      }).catch(() => { })
    },
    showAuditDialog (row) {
      this.auditStatus = false
      this.auditDialogVisible = true
    },
    doAudit () {
      this.auditDialogVisible = false
    },
    freeze (row) {
      confirmBox(this, '冻结后，供应商账户将不可用，是否冻结?').then(() => {
        successNotify(this, '供应商“123123”冻结成功')
      }).catch(() => { })
    },
    resetPassword (row) {
      confirmBox(this, '确定要重置该用户密码?').then(() => {
        successNotify(this, `密码重置成功<p>新密码：123133</p>`, true, 0)
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
