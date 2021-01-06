<template>
  <div class="delivery-list">
    <div class="delivery-introduce">
      <div class="deliver-info delivery-introduce-bg">
        <p>商家发货须知：</p>
        <p>1、每个发货单务必打一个包裹，对应一个物流单号，包裹内必须添加纸质发货清单，切勿将不同发货单商品混合打包发货。</p>
        <p>2、商家填错发货单号、快递单号，商家发货颜色、尺码、款式、细节与需求不符，按照退件处理，回寄费用商家负担，请商家严把商品质量。</p>
        <p>3、每个发货单SKU款数不超过50款，SKU件数不超过200件。</p>
        <p>4、自发货当日起超过15天未被仓库签收的发货单将自动关闭。关闭的发货单仓库不再签收做退回处理。</p>
      </div>
      <div class="warehouse-address delivery-introduce-bg">
        <p>仓库地址：XXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
        <p>{{test | dateFormat('yyyy-M-dd at hh:mm')}}</p>
      </div>
    </div>
    <SlListView
      ref="listView"
      @gotoPage="gotoPage"
      @reset="reset"
      :total="page.total"
      :pageIndex="page.pageIndex"
    >
      <div slot="search">
        <SlSearchForm ref="searchForm" v-model="searchQuery" :items="searchItems"></SlSearchForm>
      </div>
      <div class="switch-nav">
        <el-menu
          :default-active="activeIndex"
          class="color-bg--white"
          mode="horizontal"
          @select="switchNav"
        >
          <el-menu-item
            v-for="(item,index) in navList"
            :key="'index'+index"
            :index="item.index+''"
          >{{item.name}}({{item.amount?item.amount:0}})</el-menu-item>
        </el-menu>
      </div>
      <el-table
        :data="tableData"
        border
        size="mini"
        ref="multipleTable"
        class="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="发货单号" width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.days}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="订单需求数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="date" label="实际发货数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="date" label="总金额（￥）" width="100px" align="center"></el-table-column>
        <el-table-column prop="date" label="上架数量" width="120px" align="center"></el-table-column>
        <el-table-column label="最晚交货时间" width="180px" align="center">
          <template slot-scope="scope">
            <span>还剩下：{{scope.days}}天</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="结算单ID" width="100px" align="center"></el-table-column>
        <el-table-column prop="date" label="物流信息" width="180px" align="center">
          <template slot-scope="scope">
            <span>还剩下：{{scope.days}}天</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.name}}</span>
          </template>
        </el-table-column>
      </el-table>
    </SlListView>
  </div>
</template>

<script>
export default {
  name: 'DeliveryList',
  data () {
    return {
      test: '1609917853735',
      page: {
        pageIndex: 1,
        total: 0
      },
      searchQuery: {},
      searchItems: [
        {
          type: 'input',
          label: '发货单号',
          name: 'orderId'
        },
        {
          type: 'input',
          label: '订单号',
          name: 'sku'
        },
        {
          type: 'input',
          label: '供方货号',
          name: 'sku'
        },
        {
          type: 'input',
          label: 'SKU',
          name: 'sku'
        },
        {
          type: 'date',
          label: '组单时间',
          name: 'cTime',
          data: {
            datetype: 'date',
            isBlock: true
          }
        },
        {
          type: 'date',
          label: '最晚收货时间',
          name: 'uTime',
          data: {
            datetype: 'date',
            isBlock: true
          }
        },
        {
          type: 'input',
          label: '发货状态',
          name: 'sku'
        }
      ],
      tableData: [],
      activeIndex: '0',
      navList: [{ 'index': 0, 'name': '全部', 'value': 0, 'amount': 50 }, { 'index': 1, 'name': '已入驻', 'value': 1, 'amount': 28 }]
    }
  },
  methods: {

    reset () {
      this.$refs.searchForm.reset()
      this.$refs.listView.refresh()
    },

    gotoPage (pageSize = 10, pageIndex = 1) {
      this.$refs.listView.loading = false
    },

    handleSelectionChange () { },
    switchNav () { }
  }
}
</script>

<style lang="scss" scoped>
.delivery-list {
  width: 100%;
  .delivery-introduce {
    font-size: 12px;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .delivery-introduce-bg {
      background: #d3d3d3;
    }
    .deliver-info {
      width: 60%;
      padding: 20px;
    }
    .warehouse-address {
      width: 30%;
      padding: 40px 20px;
    }
  }
  .tableData {
    &-col {
      &-img {
        width: 10rem;
        height: 10rem;
        margin-right: 1rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      &-pre {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-con {
        text-align: left;
      }
    }
    /deep/ .cell {
      text-align: center;
    }
  }
}
</style>
