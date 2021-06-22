<template>
  <el-dialog :visible.sync="showDiaolog" width="50%" center @closed="reset">
    <h4 slot="title">{{isEdit?'修改':'添加'}}物流</h4>
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
      <el-form ref="form" :model="form" label-width="150px" class="logistics-form" :rules="rules">
        <el-row>
          <el-col :span="16">
            <el-form-item label="物流商" prop="id">
              <div style="width:100%;">
                <sl-select
                  v-model="form.id"
                  :options="companyList"
                  :maxHeight="200"
                  clearable
                  filterable
                  label="logisticsCompanyName"
                  value="id"
                  @change="companyListChange"
                ></sl-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align:left;line-height: 33px;padding-left:10px;">
            <el-link type="primary" @click="selfLogistics">自配送物流</el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="快递单号" prop="logisticsNumber">
              <el-input v-model="form.logisticsNumber" :disabled="isSelf"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
      isEdit: false,
      logisticsInfo: {},
      rules: {
        id: [
          { required: true, message: '请选择物流商' }
        ],
        logisticsNumber: [
          { required: true, message: '请输入物流号' }
        ]
      },
      companyList: [],
      form: {
        id: '',
        logisticsNumber: ''
      },
      selfDistributionLogisticsCode: 'self-delivery',
      isSelf: false,
      onClick: () => { }
    }
  },
  methods: {
    companyListChange () {
      let logistcs = this.companyList.find(e => e.id === this.form.id)
      if (logistcs.courierCode === this.selfDistributionLogisticsCode) { // 自配送
        this.isSelf = true
        this.selfLogistics()
      } else {
        this.isSelf = false
      }
    },
    selfLogistics () {
      let zs = this.companyList.find(e => e.courierCode === this.selfDistributionLogisticsCode)// 定位自配送
      if (zs) {
        this.form.id = zs.id
      }
      this.isSelf = true
      if (this.selfLogisticsNumber) {
        this.form.logisticsNumber = this.selfLogisticsNumber
        return
      }
      let loding = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.form.logisticsNumber = ''
      GOODS_API.selfDistributionLogistics({
        prefix: 'ZS', // 前缀
        dateFormat: 'yyMMdd', // 年月日（6位）
        sequenceType: 'SELF_DELIVERY_LOGISTICS_NUM',
        randomCodeLength: 3
      }).then(d => {
        loding.close()
        if (d.data) {
          this.selfLogisticsNumber = d.data
          this.form.logisticsNumber = d.data
        }
      }).catch(() => {
        loding.close()
      })
    },
    show (data) {
      this.logisticsInfo = _cloneDeep(data.row)
      this.isEdit = !!data.row.logisticsNumber
      this.form = {
        logisticsNumber: data.row.logisticsNumber || '',
        id: data.row.logisticsCompanyId || ''
      }

      this.companyList = _cloneDeep(data.companyList)
      let zs = this.companyList.find(e => e.id === this.form.id)// 定位自配送
      if (zs && zs.courierCode === this.selfDistributionLogisticsCode) { // 自配送
        this.selfLogisticsNumber = this.form.logisticsNumber
        this.isSelf = true
      } else {
        this.selfLogisticsNumber = ''
        this.isSelf = false
      }

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
          let type = this.isEdit ? 'modify' : 'add'
          let data = Object.assign({ deliveryOrderId: this.logisticsInfo.id, type: type }, this.form)
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
              if (Number(res.error.code) !== 900001) {
                Message({
                  message: res.error.message,
                  type: 'error'
                })
              }
              if (Number(res.error.code) === 500007) {
                setTimeout(() => {
                  location.reload()
                }, 3000)
              }
            }
          })
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
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
    width: 80%;
    .el-select--small {
      width: 100%;
    }
  }
}
</style>
