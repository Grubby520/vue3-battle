<template>
  <el-dialog :visible.sync="showDiaolog" width="50%" center>
    <h4 slot="title">添加物流</h4>
    <div class="notice">
      <p>注意！</p>
      <p class="text-i">一个发货单必须只对应一个包裹发货，请根据实际情况确认可一次性发货的SKU。如果无法一次性全部发货，请将相应不能发货的SKU从发货单里面删除。</p>
    </div>
    <div class="logistics-info">
      <p>发货单信息</p>
      <ul>
        <li>发货单号：2835001</li>
        <li>推单时间：2020-12-04 13:58:08</li>
        <li>数量总计：173</li>
        <li>采购总金额：1730.00</li>
      </ul>
    </div>
    <div class="receiving-address">
      <p>确认收货地址</p>
      <ul>
        <li>收货地址：xxxxxxxxxxxxxxxxxxxxxxxx</li>
        <li>收件人：xxxxx</li>
        <li>联系方式：13912341234</li>
      </ul>
    </div>
    <div class="notice line-h40">
      <p>请务必确保此发货单对应的物流单号填写正确，物流单号填写错误或者未填写则仓库无法签收此包裹！</p>
    </div>
    <div class="logistics-no">
      <el-form ref="form" :model="form" label-width="80px" class="logistics-form">
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep as _cloneDeep } from 'lodash'
export default {
  name: 'ModifyLogisticsNo',
  data () {
    return {
      showDiaolog: false,
      logisticsInfo: {},
      form: {
        region: '',
        name: ''
      }
    }
  },
  methods: {
    show (data) {
      this.logisticsInfo = _cloneDeep(data)
      this.showDiaolog = data.showDiaolog
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
.notice {
  padding: 0 4px;
  background: rgba(244, 164, 96, 0.2);
  border-radius: 4px;
  line-height: 18px;
  color: rgba(255, 140, 0, 0.8);
  .text-i {
    text-indent: 2em;
  }
}
.line-h40 {
  line-height: 40px;
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
