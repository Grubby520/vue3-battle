<template>
  <div class="sl-batch-input" :style="{width: width ? width + 'px' : '100%'}">
    <el-input
      ref="input"
      :placeholder="`请输入${label}`"
      @input="handleInput"
      v-model="innerValue"
      clearable
      @keyup.enter.native="keyupEnter"
    >
      <el-button v-if="showBatchButton" slot="append" type="primary" @click="multipleSku">批量</el-button>
    </el-input>
    <BatchDialog
      ref="batchDialog"
      :maxLen="maxLen"
      :label="label"
      @submit="onSubmit"
      v-bind="$attrs"
    ></BatchDialog>
  </div>
</template>

<script>
import BatchDialog from './BatchDialog'

export default {
  name: 'SlBatchInput',
  model: {
    prop: 'values',
    event: 'confirm'
  },
  props: {
    values: {
      type: String,
      default: ''
    },
    maxLen: {
      type: Number,
      default: 200
    },
    label: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 0
    },
    showBatchButton: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BatchDialog
  },
  data () {
    return {
      innerValue: '',
      multipleSkuVisible: false
    }
  },
  watch: {
    values (val) {
      this.innerValue = val
    }
  },
  mounted () {
    this.innerValue = this.values
  },
  methods: {
    handleInput () {
      this.innerValue = this.validateLength(this.innerValue)
      this.onEmit(this.innerValue)
    },
    multipleSku () {
      if (this.disabled) return
      this.$refs.batchDialog.show(this.innerValue)
    },
    onSubmit (skucode) {
      this.onEmit(skucode)
    },
    onEmit (values) {
      this.$emit('confirm', values)
    },
    validateLength (values) {
      let arr = values.split(',')
      if (arr.length > this.maxLen) {
        this.$message.warning(
          `超出允许输入最大数量${this.maxLen}个，已自动截取！`
        )
        arr.length = this.maxLen
        return arr.join(',')
      }
      return values
    },
    keyupEnter () {
      this.$emit('keyupEnter', this.innerValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.sl-batch-input {
  display: inline-block;
}
</style>
