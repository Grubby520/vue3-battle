<template>
  <SlDialog
    title="发货明细"
    :visible.sync="deliverDialogVisible"
    :width="dialogWidth"
    :loading="handleLoading"
    @cancel="cancelHandler"
    @submit="submitHandler"
  >
    <div v-loading="loading">
      <el-alert
        class="mb-2rem"
        title="请务必确保此发货单对应的物流单号填写正确，物流单号填写错误或者未填写则仓库无法签收此包裹！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <el-form
        class="delivery-form"
        ref="deliveryForm"
        :model="form"
        :rules="rules"
        :validate-on-rule-change="false"
        label-width="100px"
        inline
      >
        <el-form-item label="物流商" prop="logisticsCompanyId">
          <el-select
            v-model="form.logisticsCompanyId"
            placeholder="物流商"
            filterable
            clearable
            @change="companyChangeHandler"
          >
            <el-option
              v-for="(item,index) in companyOptions"
              :key="'opt_'+index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input
            v-model="form.logisticsNumber"
            placeholder="物流单号"
            maxlength="50"
            clearable
            :disabled="!form.logisticsCompanyId || isSelfSend"
          ></el-input>
        </el-form-item>
        <SlTableInfo
          ref="table"
          :tableData="tableData"
          :columns="columns"
          headerAlign="left"
          rowKey="purchaseOrderItemId"
        >
          <template v-slot:_count="{row}">
            <el-form-item
              label-width="0px"
              :prop="'count_'+row.purchaseOrderItemId"
              :rules="[emptyValidator('本次发货不能为空')]"
            >
              <el-input
                v-model="form['count_'+row.purchaseOrderItemId]"
                v-slFormatNumber="numberFormat"
                placeholder=">0"
              ></el-input>
            </el-form-item>
          </template>
        </SlTableInfo>
      </el-form>
    </div>
  </SlDialog>
</template>
<script>
import { errorMessageTip } from '@shared/util'
import { emptyValidator } from '@shared/validate'
import OemGoodsAPI from '@api/oemGoods'

export default {
  name: 'DeliveryDialog',
  props: {},
  data () {
    return {
      loading: false,
      handleLoading: false,
      deliverDialogVisible: false,
      dialogWidth: '60%',
      tableData: [],
      companyOptions: [],
      form: {
        logisticsCompanyId: null,
        logisticsNumber: null
      },
      emptyValidator,
      columns: [
        {
          name: 'purchaseOrderNumber',
          label: '生产订单号'
        },
        {
          name: 'skuImage',
          label: '商品图片',
          width: '150px',
          isImage: true
        },
        {
          name: 'skuCode',
          label: 'SKU编码'
        },
        {
          name: 'name',
          label: '商品名称'
        },
        {
          name: 'attributesName',
          label: '销售属性'
        },
        {
          name: 'realPrice',
          label: '单价'
        },
        {
          name: 'requireQuantity',
          label: '订单数量'
        },
        {
          name: 'alreadyDeliveryQuantity',
          label: '实际发货数量'
        },
        {
          name: '_count', // 扩展字段
          label: '本次发货数量'
        }
      ]
    }
  },
  computed: {
    isSelfSend () {
      return parseInt(this.form.logisticsCompanyId) === 'self-delivery'
    },
    rules () {
      let rules = {
        logisticsCompanyId: [
          emptyValidator('请选择物流商', ['blur', 'change'])
        ],
        logisticsNumber: [emptyValidator('请填写物流单号')]
      }
      if (this.isSelfSend) { // '自发'的情况可以不校验物流单号
        delete rules.logisticsNumber
      }

      return rules
    },
    numberFormat () {
      return { type: 'integer', max: 999999, compareLength: false, includeZero: false }
    }
  },
  mounted () {

  },
  methods: {
    openDialog ({ params }) {
      this.deliverDialogVisible = true
      this.loading = true
      OemGoodsAPI.getDeliveryConfirmList(params).then(res => {
        let { data = [] } = res
        let dynamicForm = {}
        this.tableData = data.map(item => {
          // 设置动态表单项
          dynamicForm['count_' + item.purchaseOrderItemId] = null

          return {
            ...item,
            _count: null
          }
        })

        this.form = Object.assign({
          logisticsCompanyId: null,
          logisticsNumber: null
        }, dynamicForm)
      }).finally(() => {
        this.loading = false
      })
      this.getCompanyOPtions()
    },
    getCompanyOPtions () {
      OemGoodsAPI.getLogisticsCompany().then(res => {
        let { data = [] } = res
        this.companyOptions = data.map(item => {
          return {
            label: item.logisticsCompanyName,
            value: item.id
          }
        })
      })
    },
    companyChangeHandler () {
      this.form.logisticsNumber = null
    },
    submitHandler () {
      this.$refs.deliveryForm.validate((valid) => {
        if (valid) {
          let deliveryOrderItems = this.tableData.map(row => {
            return {
              count: this.form['count_' + row.purchaseOrderItemId],
              purchaseOrderId: row.purchaseOrderId,
              purchaseOrderItemId: row.purchaseOrderItemId
            }
          })
          let { logisticsCompanyId, logisticsNumber } = this.form
          this.handleLoading = true

          OemGoodsAPI.doDelivery({
            deliveryOrderItems,
            logisticsCompanyId,
            logisticsNumber
          }).then(res => {
            let { success, error = {} } = res
            if (success) {
              this.deliverDialogVisible = false
              this.$message.success(`发货成功`)
              this.$emit('submit')
            } else {
              if (!this.$store.state.uniformlyCapturedErrorCodes.includes(error.code)) {
                errorMessageTip(error.message)
              }
            }
          }).finally(() => {
            this.handleLoading = false
          })
        }
      })
    },
    cancelHandler () {
      this.$refs.deliveryForm.clearValidate()
    }
  }
}
</script>
<style lang="scss">
.delivery-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
