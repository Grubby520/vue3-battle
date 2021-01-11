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
        <SlSearchForm ref="searchForm" v-model="query" :items="searchItems"></SlSearchForm>
      </div>
      <el-divider />
      <SlTableToolbar>
        <el-button
          type="primary"
          :disabled="!canGenerateInvoice"
          @click="generateInvoice"
          :loading="loading"
        >生成发货单</el-button>
        <el-button type="primary" :disabled="!canExport" plain>导出待发货商品详情</el-button>
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
import { date } from '@shared/util'
import CommonUrl from '@api/url.js'
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
      activeIndex: '0',
      showSplitOrderDialog: false,
      switchNavs: [],
      tableData: [],
      selections: [],
      query: {
        tabType: -1
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
          name: 'suppierId'
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
            params: { dataCode: 'SUPPLY_TYPE' } // PURCHASE_ORDER_TYPE
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
          label: '商品名称'
        },
        {
          prop: 'sellProperty',
          label: '销售属性'
        },
        {
          prop: 'orderType',
          label: '订单类型'
        },
        {
          prop: 'cTime',
          label: '创建时间',
          render: (h, data) => {
            let { row = {} } = data
            if (Array.isArray(row['cTime'])) {
              return (
                row['cTime'].map(item => {
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
            return <template></template>
          }
        },
        {
          prop: 'dueDeliveryTime',
          label: '应交货时间',
          width: '150',
          render: (h, data) => {
            let { row = {} } = data
            let dueDeliveryTime = row.dueDeliveryTime ? row.dueDeliveryTime : 0
            let offsetDays = (dueDeliveryTime - new Date().getTime()) / 1000 / 60 / 60 / 24
            return (
              <div>
                <p>{date(row.dueDeliveryTime, 'yyyy-MM-dd hh:mm:ss')}</p>
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
      return this.selections.length > 0
    },
    canExport () {
      return this.selections.length > 0
    },
    skuNumber () {
      return 10
    }
  },
  mounted () {
    this.getSwitchNavs()
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      // const params = this.generateParams(pageSize, pageIndex)
      // GoodsApi.getPurchaseTableList(params).then(res => {
      //   let { success, data = {} } = res
      //   if (success) {
      //     this.tableData = data.list
      //     this.page.total = data.total
      //   }
      // }).finally(() => {
      //   this.$refs.listView.loading = false
      // })

      this.tableData = [
        {
          baseInfo: {
            imageUrl: 'http://srm-storage-test.oss-cn-shanghai.aliyuncs.com/srm/goods/prodcut/1609813675-a7698629-39ff-4b56-952a-5ea0eb989e8e.jpg',
            supplierItemNo: '1231231',
            merchantSku: 'SKU12345678',
            sku: '1123121412'
          },
          requiredNum: 100,
          shippedNum: 100,
          shippedEnable: true,
          dueDeliveryTime: 1610356061288
        }
      ]
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
      this.activeIndex = this.query.tabType = index
      this.gotoPage()
    },
    generateParams (pageSize, pageIndex) {
      let { dueDeliveryTimes = [], ...orther } = this.query
      return {
        ...orther,
        pageIndex,
        pageSize,
        dueDeliveryStartTime: dueDeliveryTimes[0] ? dueDeliveryTimes[0] : '',
        dueDeliveryEndTime: dueDeliveryTimes[1] ? dueDeliveryTimes[1] : ''
      }
    },
    validateGenerateInvoice () {
      let skuTotal = this.selections.length
      let shippedTolNum = this.selections.reduce((prev, next) => {
        prev += next
        return prev
      }, 0)
      if (skuTotal > 50) {
        this.$message({
          showClose: true,
          message: '总SKU个数超过50，不能生成发货单',
          type: 'error',
          duration: 4500
        })
        return false
      }

      if (shippedTolNum > 200) {
        this.$message({
          showClose: true,
          message: '总发货数量超过200，不能生成发货单',
          type: 'error',
          duration: 4500
        })
        return false
      }
      return true
    },
    generateInvoice () {
      if (!this.validateGenerateInvoice()) {
        return
      }
      this.loading = true
      this.groupGenerateShippedBill(this.selections.map(item => item.id)).then(res => {
        if (res.success) {
          this.$message.success('生成发货单(FH202012310001)成功')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    openSplitDialog (row) {
      this.dialogForm = {
        orderId: row.orderId,
        sku: row.sku,
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
        orderId: submitData.orderId,
        sku: submitData.sku,
        saveRequiredNum: submitData.retainRequiredNum
      }).then(res => {
        this.showSplitOrderDialog = false
        this.gotoPage()
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
