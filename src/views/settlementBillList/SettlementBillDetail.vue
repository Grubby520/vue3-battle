<template>
  <div>
    <el-collapse v-model="collapse">
      <el-collapse-item title="付款单信息" name="1">
        <div class="grid">
          <div>
            <span>供应商编号:</span>
          </div>
          <div>
            <span>供应商名称:</span>
          </div>
          <div>
            <span>结算方式:</span>
          </div>
          <div>
            <span>付款单号:</span>
          </div>
          <div>
            <span>付款单状态:</span>
          </div>
          <div>
            <span>创建时间:</span>
          </div>
          <div>
            <span>币种:</span>
          </div>
          <div>
            <span>附件数量:</span>
          </div>
          <div>
            <span>申请付款总金额:</span>
          </div>
          <div>
            <span>结算总金额:</span>
          </div>
          <div>
            <span>补款总金额:</span>
          </div>
          <div>
            <span>扣款总金额:</span>
          </div>
          <div>
            <span>已付总金额:</span>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="财务信息" name="2">
        <div class="grid">
          <div>
            <span>开户名:</span>
          </div>
          <div>
            <span>银行账号:</span>
          </div>
          <div>
            <span>开户银行:</span>
          </div>
          <div>
            <span>开户支行:</span>
          </div>
          <div>
            <span>联系电话:</span>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="结算单信息" name="3">
        <el-button type="primary">导出</el-button>
        <el-table>
          <el-table-column label="发货单号"></el-table-column>
          <el-table-column label="结算单号"></el-table-column>
          <el-table-column label="结算金额(¥)"></el-table-column>
          <el-table-column label="供货金额(¥)"></el-table-column>
          <el-table-column label="运费补贴(¥)"></el-table-column>
          <el-table-column label="供货数量"></el-table-column>
          <el-table-column label="结算单状态"></el-table-column>
          <el-table-column label="账期时间"></el-table-column>
          <el-table-column label="确认时间"></el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="补扣款单信息" name="4">
        <el-table>
          <el-table-column label="补扣款单号"></el-table-column>
          <el-table-column label="款项类型"></el-table-column>
          <el-table-column label="源单类型"></el-table-column>
          <el-table-column label="源单编号"></el-table-column>
          <el-table-column label="总金额(¥)"></el-table-column>
          <el-table-column label="备注"></el-table-column>
          <el-table-column label="确认时间"></el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="操作日志" name="5">
        <el-table>
          <el-table-column label="操作人"></el-table-column>
          <el-table-column label="时间"></el-table-column>
          <el-table-column label="操作"></el-table-column>
          <el-table-column label="备注"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data () {
    return {
      collapse: ['1', '2', '3', '4', '5']
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 30px;
}
/deep/ .el-collapse-item__header {
  background: lightgrey;
  padding-left: 30px;
  padding-right: 20px;
  position: relative;
}
/deep/ .el-collapse-item__arrow {
  position: absolute;
  left: 10px;
  top: auto;
  bottom: auto;
}
/deep/ .el-collapse-item__content {
  padding: 30px;
}
</style>
