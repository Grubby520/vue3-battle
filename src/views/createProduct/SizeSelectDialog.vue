<template>
  <el-dialog title="尺码设置" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
    <div>
      <p>注意事项：</p>
      <p>1、查看下方尺码对照表，根据适用身高、体重匹配对应商品尺码；</p>
      <p>2、商品尺码偏大或偏小，请务必调整尺码号，按照合适尺码发货；</p>
    </div>
    <div>
      <el-checkbox-group v-model="checkedSizes">
        <template v-for="(item, index) in sizeOptions">
          <el-checkbox :key="index" :label="item.id">{{item.attrTermName}}</el-checkbox>
        </template>
      </el-checkbox-group>
    </div>
    <div>
      <h2>尺码对照表</h2>
      <el-table :data="sizeTable" border style="width: 100%; margin-bottom: 1rem;">
        <template v-for="(colVal, colKey) in columns">
          <el-table-column
            :key="colKey"
            :prop="colKey"
            :label="colVal"
            min-width="160px"
            align="center"
          ></el-table-column>
        </template>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formSizes: {
      type: Array,
      default: function () {
        return []
      }
    },
    categoryId: {
      type: [Array, String],
      default: ''
    },
    sizeOptions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      dialogVisible: true,
      checkedSizes: [],
      sizeTable: [{
        size: 'xl',
        code: 2,
        circle1: 44,
        circle2: 25
      }],
      columns: {
        size: '尺码段',
        code: '欧美码',
        circle1: '胸围（CM）',
        circle2: '腰围（CM）'
      }
    }
  },
  computed: {

  },
  watch: {
    formSizes (val) {
      this.checkedSizes = val.map(item => item.id)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
