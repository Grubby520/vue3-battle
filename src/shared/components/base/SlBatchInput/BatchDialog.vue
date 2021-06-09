<template>
  <div>
    <!-- 编辑SKU -->
    <el-dialog
      :lock-scroll="false"
      :title="'批量查询'+label"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="800px"
    >
      <el-form ref="form" :label-width="labelWidth">
        <el-form-item :label="label">
          <el-input
            :placeholder="`请输入${label}`"
            @input="()=>{this.$forceUpdate()}"
            :autosize="{ minRows: 10}"
            clearable
            type="textarea"
            v-model="values"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="font-size:14px;color:#666;">备注：一行一个，或英文逗号分隔，最多支持{{maxLen}}个批量搜索</div>
        </el-form-item>
        <el-form-item style="text-align:right;">
          <el-button type="primary" @click="onSubmitBtn">{{$t('button.submitText')}}</el-button>
          <el-button @click="visible = false">{{$t('button.cancelText')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'batchSkuInput',
  props: {
    maxLen: {
      type: Number,
      default: 200
    },
    label: String,
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  data () {
    return {
      visible: false,
      values: ''
    }
  },
  methods: {
    show (values) {
      this.visible = true
      this.values = values
    },
    onSubmitBtn () {
      const { values } = this
      let result = ''
      if (values && values.trim()) {
        let arr = values
          .split(/\r\n|[\r\n]|\uff0c/)// 中文逗号unicode编码
          .join(',')
          .split(',')
          .filter((sku) => sku && sku.trim())
        arr.forEach((item, i) => {
          arr[i] = item.trim()
        })
        if (arr.length > this.maxLen) {
          this.$message.warning(
            `超出允许输入最大数量${this.maxLen}个，已自动截取！`
          )
          arr.length = this.maxLen
        }
        result = arr.join(',')
      }

      this.visible = false
      this.$emit('submit', result)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
