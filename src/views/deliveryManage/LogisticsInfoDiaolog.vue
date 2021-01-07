<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" center class="logistics-dialog">
    <div class="content">
      <h3>物流信息</h3>
      <div class="logistics-info">
        <div>
          <p>物流单号：123123</p>
          <p>发货时间：12321</p>
        </div>
        <div>
          <p>发货单号：123123</p>
          <p>签收时间：12321</p>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border max-height="240px">
        <el-table-column prop="date" label="时间" width="120px" align="center"></el-table-column>
        <el-table-column prop="name" label="物流信息" align="center"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'LogisticsInfo',
  data () {
    return {
      dialogVisible: false,
      searchText: '1323',
      tableData: [{ date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }, { date: '123', name: '12321' }]
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.logistics-dialog {
  /deep/.el-dialog {
    height: 400px;
  }
}
.logistics-info {
  display: flex;
  justify-content: space-between;
}
</style>
