<template>
  <div>
    <MerchantNotice></MerchantNotice>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
    >
      <div slot="search">
        <!-- 搜索区域search包含搜索和重置按钮 -->
        <SlSearchForm ref="searchForm" v-model="formQuery" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button
          type="primary"
          @click="generateInvoice"
          :loading="loading"
          :disabled="!canGenerateInvoice"
        >生成发货单</el-button>
        <el-button
          type="primary"
          @click="exportDetail"
          :loading="loading"
          :disabled="!canExport"
          plain
        >导出待发货商品详情</el-button>
      </SlTableToolbar>
      <div class="switch-nav">
        <el-menu
          :default-active="activeIndex"
          class="color-bg--white"
          mode="horizontal"
          @select="switchNav"
        >
          <el-menu-item
            v-for="(item,index) in switchNavs"
            :key="'index'+index"
            :index="item.index+''"
          >
            <template v-if="item.status">
              <span
                class="switch-nav-status"
                :class="{'color-text--danger':item.status === 'danger'}"
              >{{item.statusText}}</span>
            </template>
            {{item.name}}({{item.amount?item.amount:0}})
          </el-menu-item>
        </el-menu>
        <div class="choosed-sku-statistics">
          选中SKU：
          <span>SKU款数({{selections.length}})</span>&nbsp;&nbsp;
          <span>SKU件数({{skuNumber}})</span>
        </div>
      </div>
      <!-- 表格区域包含分页 -->
      <SlTable
        ref="table"
        v-model="selections"
        :tableData="tableData"
        :columns="columns"
        :operate="false"
        :tooltip="false"
        rowKey="id"
      ></SlTable>
    </SlListView>
    <!-- 拆单对话框 -->
    <SplitOrderDialog
      :showDialog.sync="showSplitOrderDialog"
      :inData="dialogForm"
      @submit="submitSplitOrder"
    ></SplitOrderDialog>
  </div>
</template>

<script>
import { exportFileFromRemote, date, errorMessageTip } from '@shared/util'
import CommonUrl from '@api/url.js'
import GoodsUrl from '@api/goods/goodsUrl'
import GoodsApi from '@api/goods'
import MerchantNotice from './stayGroupedGoods/MerchantNotice'
import SplitOrderDialog from './stayGroupedGoods/SplitOrderDialog'

export default {
  name: 'StayGroupedGoods',
  components: {
    MerchantNotice,
    SplitOrderDialog
  },
  data () {
    return {
      loading: false,
      activeIndex: '-1',
      showSplitOrderDialog: false,
      switchNavs: [],
      tableData: [],
      selections: [],
      extraQuery: {
        type: -1
      },
      formQuery: {
      },
      page: {
        pageIndex: 1,
        total: 0
      },
      searchItems: [
        {
          type: 'input',
          label: '订单号',
          name: 'orderId'
        },
        {
          type: 'input',
          label: '供方货号',
          name: 'supplierNum'
        },
        {
          type: 'input',
          label: '商家SKU',
          name: 'merchantSku'
        },
        {
          type: 'input',
          label: 'SKU',
          name: 'sku'
        },
        {
          type: 'single-select',
          label: '订单类型',
          name: 'orderType',
          data: {
            remoteUrl: CommonUrl.dictUrl,
            params: { dataCode: 'PURCHASE_ORDER_TYPE' }
          }
        },
        {
          type: 'date',
          label: '应交货时间',
          name: 'dueDeliveryTimes',
          data: {
            datetype: 'daterange',
            isBlock: true
          }
        }
      ],
      columns: [
        {
          prop: 'orderId',
          label: '订单号'
        },
        {
          prop: 'baseInfo',
          label: '基本信息',
          width: '300',
          isInImg: 'imageUrl',
          pre: {
            supplierItemNo: '供方货号',
            merchantSku: '商家SKU',
            sku: 'SKU'
          }
        },
        {
          prop: 'productName',
          label: '商品名称',
          width: '225',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <el-tooltip content={row.productName} placement="top" effect="light">
                <ellipsis text={row.productName} lineNum={2} tagName="p" width='225px'></ellipsis>
              </el-tooltip>
            )
          }
        },
        {
          prop: 'sellProperty',
          label: '销售属性',
          width: '150'
        },
        {
          prop: 'orderTypeDes',
          label: '订单类型'
        },
        {
          prop: 'ctime',
          label: '创建时间',
          width: '250px',
          render: (h, data) => {
            let { row = {} } = data
            if (Array.isArray(row['ctime'])) {
              return (
                row['ctime'].map(item => {
                  if (!item.timeStamp) return ''
                  return (
                    <div>
                      <span>{item.typeDes}:</span>
                      <span>{item.timeStamp}</span>
                    </div>
                  )
                })
              )
            }
            return <template></template>
          }
        },
        {
          prop: 'dueDeliveryTime',
          label: '应交货时间',
          width: '100',
          render: (h, data) => {
            let { row = {} } = data
            let dueDeliveryTime = row.dueDeliveryTime ? +new Date(row.dueDeliveryTime) : 0
            let offsetDays = (dueDeliveryTime - new Date().getTime()) / 1000 / 60 / 60 / 24
            if (!row.dueDeliveryTime) return ''
            return (
              <div>
                <p>{date(dueDeliveryTime, 'yyyy-MM-dd')}</p>
                <span class="color-text--danger">{offsetDays >= 0 ? `还剩余${parseInt(offsetDays)}天` : '已超期'}</span>
              </div>
            )
          }
        },
        {
          prop: 'requiredNum',
          label: '需求数量'
        },
        {
          prop: 'shippedNum',
          label: '发货数量',
          render: (h, data) => {
            let { row = {} } = data
            return (
              <div>
                <el-input
                  vModel={row.shippedNum} placeholder="请输入数量"
                  vSlFormatNumber={{ type: 'integer', max: 999999, compareLength: true, includeZero: true }} disabled></el-input>
                <div class="mt-1rem">
                  <el-button type="primary" onClick={() => this.openSplitDialog(row)} disabled={!row.shippedEnable}>拆单</el-button>
                </div>
              </div>
            )
          }
        }
      ],
      dialogForm: {}
    }
  },
  computed: {
    canGenerateInvoice () {
      return this.selections.length > 0 // 后续会加权限控制
    },
    canExport () {
      return this.selections.length > 0 // 后续会加权限控制
    },
    skuNumber () {
      return this.selections.reduce((prev, next) => {
        prev += next.shippedNum
        return prev
      }, 0)
    },
    hasRepeatOrderIdAndSkucode () {
      let tempMap = {}
      for (let i = 0, len = this.selections.length; i < len; i++) {
        let item = this.selections[i]
        let key = item.orderId + item.baseInfo.sku
        if (!tempMap[key]) {
          tempMap[key] = 1
        } else {
          tempMap[key]++
        }
        if (tempMap[key] > 1) {
          return true
        }
      }
      return false
    }
  },
  mounted () {

  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      const params = this.generateParams(pageSize, pageIndex)
      GoodsApi.getGroupList(params).then(res => {
        let { success, data = {} } = res
        if (success) {
          this.tableData = data.list
          this.page.total = data.total
        }
      }).finally(() => {
        this.$refs.listView.loading = false
        this.getSwitchNavs()
      })
    },
    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },
    getSwitchNavs () {
      GoodsApi.getGroupTabs({}).then(data => {
        this.switchNavs = data
      })
    },
    switchNav (index) {
      this.selections = []
      this.activeIndex = this.extraQuery.type = index
      this.gotoPage()
    },
    generateParams (pageSize, pageIndex) {
      let { dueDeliveryTimes = [], ...orther } = this.formQuery
      return {
        ...orther,
        ...this.extraQuery,
        pageIndex,
        pageSize,
        dueDeliveryStartTime: dueDeliveryTimes[0] ? dueDeliveryTimes[0] : '',
        dueDeliveryEndTime: dueDeliveryTimes[1] ? dueDeliveryTimes[1] : ''
      }
    },
    validateGenerateInvoice () {
      let skuTotal = this.selections.length

      if (skuTotal > 50) {
        errorMessageTip('总SKU个数超过50，不能生成发货单')
        return false
      }

      if (this.skuNumber > 200) {
        errorMessageTip('总发货数量超过200，不能生成发货单')
        return false
      }

      if (this.hasRepeatOrderIdAndSkucode) {
        errorMessageTip('一个发货单上不能存在两条订单号和SKU都相同的记录')
        return false
      }
      return true
    },
    generateInvoice () {
      if (!this.validateGenerateInvoice()) {
        return
      }
      this.loading = true
      GoodsApi.groupGenerateShippedBill({
        ids: this.selections.map(item => item.id)
      }).then(res => {
        if (res.success) {
          this.$message.success(`生成发货单(${res.data})成功`)
          this.selections = []
          this.gotoPage()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    exportDetail () {
      exportFileFromRemote({
        url: GoodsUrl.groupExport,
        name: `待发货SKU维度详情_${date(+new Date(), 'yyyy-MM-dd')}.xlsx`,
        beforeLoad: () => {
          this.loading = true
          this.$store.dispatch('OPEN_LOADING')
        },
        afterLoad: () => {
          this.loading = false
          this.selections = []
          this.$store.dispatch('CLOSE_LOADING')
        },
        successFn: () => { },
        errorFn: () => { }
      })
    },
    openSplitDialog (row) {
      this.dialogForm = {
        id: row.id,
        sku: row.baseInfo.sku,
        src: row.baseInfo.imageUrl,
        merchantSku: row.baseInfo.merchantSku,
        requiredNum: row.requiredNum,
        retainRequiredNum: row.requiredNum - row.shippedNum,
        shippedNum: row.shippedNum
      }
      this.showSplitOrderDialog = true
    },
    submitSplitOrder (submitData) {
      GoodsApi.groupSplite({
        id: submitData.id,
        sku: submitData.sku,
        saveRequiredNum: parseInt(submitData.retainRequiredNum)
      }).then(res => {
        if (res.success) {
          this.showSplitOrderDialog = false
          this.gotoPage()
          this.$message.success(`拆单成功`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.choosed-sku-statistics {
  position: absolute;
  top: 50%;
  right: 2em;
  transform: translateY(-50%);
}
</style>
