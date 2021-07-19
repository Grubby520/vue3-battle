<template>
  <SlDialog title="物流单号" :visible.sync="deliverDialogVisible" :width="dialogWidth">
    <div v-loading="loading">
      <div class="logistics-main mb-2rem">
        <div class="logistics-main--header">
          <img
            class="align-middle mr-8px"
            src="@/assets/images/business/car-logistics.png"
            alt="car"
            srcset
            style="margin-top:-3px"
          />
          物流信息
        </div>

        <el-row class="logistics-main--content">
          <el-col v-for="item in iteratorProps" :span="12" :key="item.prop">
            <span class="line-height-20 prop-label mr-8px">{{item.label}}:</span>
            <span
              class="line-height-20 prop-value"
            >{{form[item.prop]}}{{item.extend?item.extend.render.call(form):''}}</span>
          </el-col>
        </el-row>
      </div>
      <SlTable
        ref="table"
        align="left"
        :selection="false"
        :border="true"
        :tableData="tableData"
        :columns="columns"
        :operate="false"
        :tooltip="false"
        :isEmbedTable="true"
        maxHeight="320px"
      ></SlTable>
    </div>
    <template v-slot:bottom>
      <el-button @click="deliverDialogVisible = false">关闭</el-button>
    </template>
  </SlDialog>
</template>
<script>
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'OemLogisticsInfoDialog',
  props: {},
  data () {
    return {
      loading: false,
      handleLoading: false,
      deliverDialogVisible: false,
      dialogWidth: '60%',
      form: {},
      tableData: [],
      props: [
        {
          prop: 'logisticsBillNumber',
          label: '物流单号',
          extend: {
            render () {
              return `(${this.logisticsCompanyName})`
            }
          }
        },
        {
          prop: 'deliveryOrderNumber',
          label: '发货单号'
        },
        {
          prop: 'createdTime',
          label: '发货时间'
        }
      ],
      iteratorProps: [],
      columns: [
        {
          prop: 'date',
          label: '时间',
          width: '200px'
        },
        {
          prop: 'content',
          label: '物流信息'
        }
      ]
    }
  },
  methods: {
    openDialog ({ courierCode, logisticsCompanyName, logisticsBillNumber, deliveryOrderNumber, status, createdTime, signInTime }) {
      this.deliverDialogVisible = true
      this.loading = true
      this.iteratorProps = [].concat(this.props)
      if (parseInt(status) >= 1) {
        this.iteratorProps.push({
          prop: 'signInTime',
          label: '签收时间'
        })
      }
      this.form = {
        logisticsCompanyName,
        logisticsBillNumber,
        deliveryOrderNumber,
        createdTime,
        signInTime
      }
      OemGoodsAPI.genLogisticsInfo({
        logisticsCompanyName,
        logisticsCompanyCode: courierCode,
        logisticsNumber: logisticsBillNumber
      }).then(res => {
        let { data = [] } = res
        this.tableData = (data[0] && data[0].trackingInfoDetailList) || []
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
@import '@assets/scss/_var.scss';
.line-height-20 {
  line-height: 2rem;
}

.logistics-main {
  border: 1px solid #edf0f2;
  .logistics-main--header {
    padding-left: 1rem;
    line-height: 4rem;
    background-color: $color-table-header-bg;
  }

  .logistics-main--content {
    padding: 1rem;
  }
}

.prop-label {
  color: $color-text-primary;
}

.prop-value {
  color: $color-text-minor;
}
</style>
