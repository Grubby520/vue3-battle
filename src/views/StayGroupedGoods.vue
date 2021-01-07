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
        <el-button type="primary" :disabled="!canGenerateInvoice">生成发货单</el-button>
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
      activeIndex: '0',
      showSplitOrderDialog: false,
      switchNavs: [],
      tableData: [],
      selections: [],
      query: {},
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
            options: []
          }
        },
        {
          type: 'date',
          label: '应交货时间',
          name: 'dueDeliveryTime',
          data: {
            datetype: 'date',
            isBlock: true
          }
        }
      ],
      columns: [
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
          prop: 'categoryName',
          label: '品类'
        },
        {
          prop: 'description',
          label: '商品描述'
        },
        {
          prop: 'productStatusName',
          label: '状态'
        },
        {
          prop: 'shippedNum',
          label: '发货数量',
          render: (h, data) => {
            return (
              <div>
                <el-input
                  vModel={data.row.shippedNum} placeholder="请输入数量"
                  vSlFormatNumber={{ type: 'integer', max: 999999, compareLength: true, includeZero: true }} disabled></el-input>
                <div class="mt-1rem">
                  <el-button type="primary" onClick={() => this.openSplitDialog(data)}>拆单</el-button>
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
    this.switchNavs = this.getSwitchNavs()
  },
  methods: {
    gotoPage (pageSize = 10, pageIndex = 1) {
      // const params = { ...this.query, pageIndex, pageSize }
      this.tableData = [
        {
          baseInfo: {
            imageUrl: 'http://srm-storage-test.oss-cn-shanghai.aliyuncs.com/srm/goods/prodcut/1609813675-a7698629-39ff-4b56-952a-5ea0eb989e8e.jpg',
            supplierItemNo: '1231231',
            merchantSku: 'SKU12345678',
            sku: '1123121412'
          },
          shippedNum: 23
        }
      ]
      this.$refs.listView.loading = false
      this.page.total = 1
    },
    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },
    getSwitchNavs () {
      return [
        { 'index': 0, 'name': '全部待组单', 'value': null, 'amount': 50 },
        { 'index': 1, 'name': '1日未组单', 'value': 1, 'amount': 28 },
        {
          'index': 2, 'name': '3日未组单', 'value': null, 'amount': 50, status: 'danger', statusText: '预警!'
        },
        {
          'index': 3, 'name': '5日未组单', 'value': null, 'amount': 50, status: 'danger', statusText: '严重预警!'
        },
        {
          'index': 4, 'name': '7日未组单', 'value': null, 'amount': 50, status: 'danger', statusText: '严重预警!'
        }
      ]
    },
    switchNav (index) {
      // let item = this.switchNavs[parseInt(index)]
      this.activeIndex = index
      this.gotoPage()
    },
    openSplitDialog (data) {
      this.dialogForm = {
        src: 'http://srm-storage-test.oss-cn-shanghai.aliyuncs.com/srm/goods/prodcut/1609813675-a7698629-39ff-4b56-952a-5ea0eb989e8e.jpg',
        merchantSku: '1231231293798',
        requiredNum: 1234,
        retainRequiredNum: 123,
        shippedNum: 0
      }
      this.showSplitOrderDialog = true
    },
    submitSplitOrder (data) {
      console.log(data)
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
