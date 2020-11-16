<template>
  <el-cascader
    :options="regionData"
    v-model="address"
    @change="handleChange"
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
  ></el-cascader>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
  name: 'SlAreaCascader',
  data () {
    return {
      regionData, // 地址信息
      address: ''
    }
  },
  model: {
    prop: 'modelVal',
    event: 'valChange'
  },
  props: {
    // 绑定值
    modelVal: {
      type: [Array],
      required: true,
      default: () => []
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否支持清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 组件尺寸
    size: {
      type: String,
      default: 'small'
    }
  },
  methods: {
    // 数据变更上报
    handleChange () {
      this.$emit('valChange', this.address)
    }
  },
  watch: {
    modelVal: {
      handler: function (val) {
        if (val instanceof Array) {
          this.address = val
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
