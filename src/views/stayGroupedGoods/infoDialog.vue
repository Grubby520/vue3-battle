<template>
  <el-dialog
    :visible="visible"
    :width="width"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
  >
    <template #title>
      <p class="el-message-box__title">
        <i class="el-icon-warning" style="color: #409EFF;"></i>
        {{title}}
      </p>
    </template>
    <el-row>
      <el-col class="mt-m">您当前未填写退货信息，无退货信息将无法进行组单生成发货单。</el-col>
      <el-col class="mt-m">
        退货信息填写：
        <router-link to="/home/basic/my-file">基础资料</router-link>
      </el-col>
    </el-row>
    <div class="sl-dialog-footer" style="text-align: right;">
      <el-button type="primary" @click="submit">知道了</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'InfoDialog',
  props: {
    title: {
      type: String,
      default: '消息'
    },
    width: {
      type: String,
      default: '40%'
    },
    showClose: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submit () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.mt-m {
  margin-bottom: 15px;
}
.sl-dialog-footer {
  text-align: center;
}
</style>
