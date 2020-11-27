<template>
  <!-- 颜色设置 -->
  <el-dialog :visible.sync="show" width="50%" title="颜色设置" center @close="hide">
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
      // 是否正在请求基础数据
      isLoading: false,
      // 是否正在提交数据
      isConfirm: false
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
</style>
