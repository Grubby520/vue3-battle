<template>
  <div class="tableForm">
    <el-form ref="form" :model="form">
      <el-table ref="table" :data="form.tableData" empty-text="暂无数据" border>
        <el-table-column label="女装尺码">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model="scope.row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="颜色">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model.number="scope.row.age" type="number"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="供货价格(RMB)">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model.number="scope.row.age" type="number"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="商家SKU编码">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model.number="scope.row.age" type="number"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="带包装重量(KG)">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model.number="scope.row.age" type="number"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="del(scope.$index)" icon="el-icon-delete"></el-button>
            <el-button type="primary" size="mini" @click="add" icon="el-icon-plus"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        tableData: []
      }
    }
  },
  methods: {
    add () {
      this.form.tableData.push({})
    },
    del (index) {
      this.form.tableData.splice(index, 1)
    }
  }
}

</script>
<style scoped lang="scss">
</style>
