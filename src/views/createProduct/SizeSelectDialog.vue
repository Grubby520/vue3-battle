<template>
  <el-dialog
    title="尺码设置"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="tip-area">
      <p class="tip-title">注意事项：</p>
      <p class="tip-item">1、查看下方尺码对照表，根据适用身高、体重匹配对应商品尺码；</p>
      <p class="tip-item">2、商品尺码偏大或偏小，请务必调整尺码号，按照合适尺码发货；</p>
    </div>

    <div class="size-area">
      <span class="check-title">尺码</span>
      <div class="size-content">
        <div class="check-area">
          <el-checkbox-group v-model="checkedSizes">
            <template v-for="(item, index) in sizeOptions">
              <el-checkbox :key="index" :label="item.id">{{item.attrTermName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
        <div class="table-area">
          <h2>尺码对照表</h2>
          <el-table
            :data="sizeTable"
            border
            max-height="400"
            style="width: 100%; margin-bottom: 1rem;"
          >
            <template v-for="(colVal, colKey) in columns">
              <el-table-column
                :key="colKey"
                :prop="colKey"
                :label="colVal"
                min-width="80px"
                align="center"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>

    <div class="tip-area">
      <p class="tip-item tip-center">已存在的属性值不可取消，若要修改SKU的颜色、尺码属性值，请联系商品负责人进行修改</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'

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
      type: [Number, String],
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
      dialogVisible: false,
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
    visible (val) {
      this.dialogVisible = val
      this.checkedSizes = this.formSizes.map(item => item.id)
    },
    formSizes (val) {
      this.checkedSizes = val.map(item => item.id)
    },
    'categoryId': {
      handler (val) {
        if (val) {
          // this.getSizeTable()
        }
      },
      immediate: true
    }
  },
  mounted () {

  },
  methods: {
    handleConfirm () {
      let formSizes = this.sizeOptions.filter(item => this.checkedSizes.includes(item.id))
      this.$emit('confirm', formSizes)
      this.handleClose()
    },
    handleClose () {
      this.$emit('update:visible', false)
    },
    getSizeTable () {
      let params = {
        categoryId: this.categoryId
      }
      RecommendApi.allByUser(params).then(res => {
        if (res.data) {
          let { sizeTable, columns } = res.data
          this.sizeTable = sizeTable
          this.columns = columns
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tip-area {
  color: #f56c6c;
  padding-bottom: 2rem;
  line-height: 2rem;
  .tip-item {
    margin-left: 2rem;
  }
  .tip-center {
    text-align: center;
    padding-top: 3rem;
  }
}
.size-area {
  position: relative;
  padding: 4rem;
  margin-top: 4rem;
  background: #fff6f6;
  .check-title {
    position: absolute;
    top: -4rem;
    left: 0;
    width: 10rem;
    line-height: 4rem;
    padding-bottom: 5px;
    text-align: center;
    border: 1px solid #fff6f6;
    border-bottom: none;
    background: #fff6f6;
    border-radius: 5px;
  }
  .size-content {
    background: white;
  }
}
.check-area {
  position: relative;
  padding: 4rem 4rem 3rem;
  border: 1px solid #ebeef5;
  margin-bottom: 2rem;
  /deep/ .el-checkbox {
    margin-bottom: 1rem;
  }
}
.table-area {
  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
}
/deep/ .el-dialog__footer {
  text-align: center;
  .el-button {
    margin-right: 4rem;
  }
}
</style>
