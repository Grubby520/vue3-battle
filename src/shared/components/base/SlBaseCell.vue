<template>
  <el-row>
    <el-col :span="left">
      <div ref="label" class="cell">{{label}}</div>
    </el-col>
    <el-col :span="middle" class="middle">
      <slot />
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'SlBaseCell',
  props: {
    spans: {
      type: Array,
      required: false,
      default: (_) => {
        return []
      }
    },
    label: { type: String, required: true },
    value: { type: String, required: false }
  },
  data () {
    return {
      left: 3,
      middle: 16
    }
  },
  mounted () {
    if (this.spans && this.spans.length > 0) {
      this.left = this.spans[0]
      this.middle = this.spans[1]
    }
  }
}
</script>
<style lang="scss">
.cell {
  font-size: 13px;
  font-weight: normal;
  line-height: 20px;
  text-align: left;
  padding: 4px 12px 4px 0;
}
.middle > div {
  width: 100%;
}
</style>
