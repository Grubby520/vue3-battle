<template>
  <el-dialog :visible.sync="showDiaolog" width="50%" center>
    <h4 slot="title">{{form.id?'修改':'添加'}}物流</h4>
    <el-alert
      title="注意！"
      type="warning"
      :closable="false"
      description="一个发货单必须只对应一个包裹发货，请根据实际情况确认可一次性发货的SKU。如果无法一次性全部发货，请将相应不能发货的SKU从发货单里面删除。"
    ></el-alert>
    <div class="logistics-info">
      <p>发货单信息</p>
      <ul>
        <li>发货单号：{{logisticsInfo.orderNumber}}</li>
        <li>组单时间：{{logisticsInfo.singleTime}}</li>
        <li>数量总计：{{logisticsInfo.deliveryNum}}</li>
        <li>采购总金额：{{logisticsInfo.totalPrice}}</li>
      </ul>
    </div>
    <div class="receiving-address">
      <p>确认收货地址</p>
      <ul>
        <li>收货地址：{{logisticsInfo.consigneeAddress}}</li>
        <li>收件人：{{logisticsInfo.consigneeName}}</li>
        <li>联系方式：{{logisticsInfo.consigneePhone}}</li>
      </ul>
    </div>
    <el-alert
      title
      type="warning"
      :closable="false"
      description="请务必确保此发货单对应的物流单号填写正确，物流单号填写错误或者未填写则仓库无法签收此包裹！"
    ></el-alert>
    <div class="logistics-no">
      <el-form ref="form" :model="form" label-width="80px" class="logistics-form" :rules="rules">
        <el-form-item label="物流商" prop="id">
          <!-- <el-select v-model="form.id" placeholder="物流商" filterable>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.logisticsCompanyName"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <sl-select
            v-model="form.id"
            :options="companyList"
            :maxHeight="200"
            clearable
            filterable
            label="logisticsCompanyName"
            value="id"
          ></sl-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNumber">
          <el-input v-model="form.logisticsNumber"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submit">{{this.logisticsInfo.logisticsNumber ? '修改':'添加'}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep as _cloneDeep, find as _find } from 'lodash'
import GOODS_API from '@api/goods'
import { Message } from 'element-ui'

export default {
  name: 'ModifyLogisticsNo',
  data () {
    return {
      showDiaolog: false,
      logisticsInfo: {},
      rules: {
        id: [
          { required: true, message: '请选择物流商', trigger: 'change' }
        ],
        logisticsNumber: [
          { required: true, message: '请输入物流号', trigger: 'blur' }
        ]
      },
      companyList: [],
      form: {
        id: '',
        logisticsNumber: ''
      },
      onClick: () => { }
    }
  },
  methods: {
    show (data) {
      this.logisticsInfo = _cloneDeep(data.row)
      this.form = {
        logisticsNumber: data.row.logisticsNumber || '',
        id: data.row.logisticsCompanyId || ''
      }

      this.companyList = _cloneDeep(data.companyList)
      this.showDiaolog = data.showDiaolog
      this.onClick = data.onClick
    },
    submit () {
      if (this.logisticsInfo.logisticsNumber === this.form.logisticsNumber && this.logisticsInfo.logisticsCompanyId === this.form.id) {
        Message({
          showClose: true,
          message: '没做修改',
          type: 'warning'
        })
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = Object.assign({ deliveryOrderId: this.logisticsInfo.id }, this.form)
          GOODS_API.modifyLogisticsNo(data).then(res => {
            if (res.success) {
              let obj = _find(this.companyList, (item) => item.id === this.form.id)
              let params = {
                courierCode: obj.courierCode,
                courierName: obj.courierName,
                logisticsCompanyName: obj.logisticsCompanyName,
                logisticsNumber: this.form.logisticsNumber,
                logisticsCompanyId: this.form.id,
                type: 1
              }
              this.onClick(params)
              this.showDiaolog = false
            } else {
              Message({
                message: res.error.message,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
p {
  font-size: 12px;
}
.logistics-info {
  margin: 8px 0;
}
.receiving-address {
  margin-bottom: 8px;
}

.logistics-info,
.receiving-address {
  p {
    font-size: 14px;
    margin-bottom: 8px;
  }
  li {
    text-indent: 2em;
    font-size: 12px;
    line-height: 16px;
  }
}

.logistics-no {
  text-align: center;
  .logistics-form {
    margin-top: 8px;
    display: inline-block;
    width: 50%;
    .el-select--small {
      width: 100%;
    }
  }
}
</style>
