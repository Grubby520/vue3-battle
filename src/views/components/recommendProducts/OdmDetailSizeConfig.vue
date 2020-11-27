<template>
  <!-- 尺码设置 -->
  <el-dialog :visible.sync="show" width="70%" title="尺码设置" center @close="hide">
    <div class="tips">
      <label class="tips-title">注意事项:</label>
      <div class="tips-content">
        <p>1. 查看下方尺码对照表，根据适用身高、体重匹配对应商品尺码；</p>
        <p>2. 商品尺码偏大或偏小，请务必调整选择尺码号，按照合适尺码发货；</p>
      </div>
    </div>
    <!-- 尺码设置 -->
    <el-tabs v-model="activeTab" type="card" @tab-click="changeTab">
      <el-tab-pane label="尺码" name="size">
        <div class="size-data">
          <div class="size-data__filter">
            <el-checkbox-group v-model="filter.sizeList">
              <el-checkbox label="One-Size"></el-checkbox>
              <el-checkbox label="XS"></el-checkbox>
              <el-checkbox label="S"></el-checkbox>
            </el-checkbox-group>
          </div>
          <h3 class="size-data__title">尺码对照表</h3>
          <SlTable
            ref="table"
            :table-data="tableData"
            :columns="columns"
            :operate="false"
            :selection="false"
          ></SlTable>
        </div>
      </el-tab-pane>
    </el-tabs>
    <p class="extra-tips">已存在的属性值不可取消，若要修改SKU颜色、尺码属性值，请联系商品负责人进行修改</p>
    <!-- 操作模块 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'OdmDetailColorConfig',
  data () {
    return {
      // 控制弹窗是否展示
      show: false,
      // 激活的Tab项
      activeTab: 'size',
      // 是否正在请求基础数据
      isLoading: false,
      // 是否正在提交数据
      isConfirm: false,

      // 尺寸表格数据
      filter: {
        // 尺码集合，需要回调给父页面
        sizeList: []
      },
      tableData: [],
      columns: [
        {
          prop: 'categoryName',
          label: '尺码段'
        },
        {
          prop: 'categoryName',
          label: '欧美码'
        },
        {
          prop: 'categoryName',
          label: '胸围'
        },
        {
          prop: 'categoryName',
          label: '腰围'
        },
        {
          prop: 'categoryName',
          label: '臀围'
        }
      ]
    }
  },
  methods: {
    /**
    * 打开弹窗
    * @param {Object} data 入口传入的数据
    */
    open (data) {
      this.show = true
    },
    /**
    * 初始化表单数据
    */
    initData () {

    },
    // 提交表单数据
    confirm () {
      // 表单业务操作完毕，关闭弹窗
      this.hide()
    },
    // tab项切换
    changeTab () {

    },
    hide () {
      this.$emit('hide', 'colorConfig')
      this.resetData()
    },
    // 重置弹窗数据
    resetData () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  font-size: 1.8rem;
  line-height: 2;
  &-title {
    font-weight: 700;
  }
  margin-bottom: 2rem;
}
/deep/.el-tabs__header {
  margin-bottom: -1px;
}
/deep/.el-tab-pane {
  border: 1px solid #e4e7ed;
  padding: 2rem;
}

/deep/.el-table--border {
  border-left: unset;
  border-right: unset;
}

.size-data {
  border: 1px solid #e4e7ed;
  max-height: 500px;

  &__filter {
    padding: 2rem;
    border-bottom: 0.2rem solid #e4e7ed;
  }

  &__title {
    text-align: center;
    font-size: 2.2rem;
    padding: 1.5rem 0;
    border-bottom: 1px dotted #e4e7ed;
    margin-bottom: 1rem;
  }

  &__tips {
    font-size: 1.8rem;
    line-height: 2;
  }
}

.extra-tips {
  font-size: 1.8rem;
  line-height: 2;
  text-align: center;
}
</style>
