<template>
  <div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      :total="page.total"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
      :pageSizes="pageSizes"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm
          ref="searchForm"
          v-model="formQuery"
          :items="searchItems"
          :loading="loading"
          @reset="gotoPage(page.pageSize)"
          @search="gotoPage(page.pageSize)"
        ></SlSearchForm>
      </div>
      <SlTableToolbar>
        <SlButton
          v-if="tableData.length > 0"
          type="primary"
          boxShadow="primary"
          :loading="loading"
          :disabled="selections.length === 0"
          @click="openConfirmDialog"
        >接单</SlButton>
      </SlTableToolbar>
      <!-- 表格区域包含分页 -->
      <SlCardTable
        ref="cardTable"
        :data="tableData"
        :childColumns="childColumns"
        :columns="columns"
        :selections.sync="selections"
        selectable
        childName="purchaseOrderItemVoList"
      ></SlCardTable>
    </SlListView>

    <SlDialog
      title="确认接单"
      :visible.sync="confirmDialogVisible"
      :loading="loading"
      @submit="receiveOrder"
    >请确认商品信息、单价、订单数量后接单</SlDialog>

    <SlDialog title="提示" :visible.sync="messageVisible">
      <el-alert
        class="mb-8px"
        :title="`成功${message.successOrderNum}个`"
        type="success"
        show-icon
        :closable="false"
      ></el-alert>
      <el-alert
        class="mb-8px"
        :title="`错误${message.failOrderNum}个`"
        type="error"
        show-icon
        :closable="false"
      ></el-alert>
      <el-tag
        class="mr-8px"
        v-for="(orderNo,index) in message.failOrderList"
        type="info"
        :key="'index_'+index"
      >{{orderNo}}</el-tag>
      <template v-slot:bottom>
        <el-button @click="closeMessageDialog">关闭</el-button>
      </template>
    </SlDialog>
  </div>
</template>

<script>
import { errorMessageTip } from '@shared/util'
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'PendingOrderList',
  data () {
    return {
      loading: false,
      confirmDialogVisible: false,
      messageVisible: false,
      tableData: [],
      selections: [],
      extraQuery: {
        status: 0
      },
      formQuery: {},
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      pageSizes: [10],
      searchItems: [
        {
          type: 'batch-input',
          label: '生产订单号',
          name: 'purchaseOrderNumber'
        },
        {
          type: 'input',
          label: 'SKU编码',
          name: 'sku'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'commodityName'
        },
        {
          type: 'date',
          label: '下单时间',
          name: 'orderTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          prop: 'orderTime',
          label: '下单时间'
        }
      ],
      childColumns: [
        {
          prop: 'skuCode',
          label: 'SKU编码'
        },
        {
          prop: 'skuImage',
          label: '商品图片',
          isImg: true,
          data: {
            imgSize: '8rem'
          }
        },
        {
          prop: 'name',
          label: '商品名称'
        },
        {
          prop: 'attributesName',
          label: '销售属性'
        },
        {
          prop: 'orderTypeName',
          label: '订单类型'
        },
        {
          prop: 'realPrice',
          label: '单价'
        },
        {
          prop: 'requireQuantity',
          label: '订单数量'
        },
        {
          prop: 'claimArrivalDate',
          label: '应交货时间'
        }
      ],
      message: {
        failOrderNum: 0,
        successOrderNum: 0,
        failOrderList: []
      }
    }
  },
  computed: {
  },
  mounted () { },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      this.loading = true
      OemGoodsAPI.getPurchaseOrderList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
          this.page.pageIndex = pageIndex
          this.page.pageSize = pageSize
          this.selections = []
        }
      }).finally(() => {
        this.loading = false
      })
    },

    receiveOrder () {
      const ids = this.selections.map(item => item.id)
      this.loading = true
      OemGoodsAPI.receiveOrder(ids).then(res => {
        let { success, error = {}, data = {} } = res
        if (success) {
          let { failOrderList, result, successNum } = data
          if (result === true) {
            this.$message.success(`接单成功`)
            this.selections = []
            this.confirmDialogVisible = false
            this.gotoPage()
            return
          }
          failOrderList = failOrderList || []
          this.message.failOrderNum = failOrderList.length
          this.message.successOrderNum = successNum
          this.message.failOrderList = failOrderList
          this.messageVisible = true
        } else {
          errorMessageTip(error.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    generateParams (pageSize, pageIndex) {
      let { orderTimes = [], ...orther } = this.formQuery
      return {
        ...orther,
        ...this.extraQuery,
        pageIndex,
        pageSize,
        orderTimeStart: orderTimes && orderTimes[0] ? orderTimes[0] : '',
        orderTimeEnd: orderTimes && orderTimes[1] ? orderTimes[1] : ''
      }
    },
    openConfirmDialog () {
      this.confirmDialogVisible = true
    },
    closeMessageDialog () {
      this.confirmDialogVisible = false
      this.messageVisible = false
      this.selections = []
      this.gotoPage()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
