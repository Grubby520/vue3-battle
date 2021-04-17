<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :show-close="showClose"
    :close-on-press-escape="false"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
  >
    <el-form v-if="dialogVisible" ref="dialogForm" :model="form" :rules="rules" label-width="100px">
      <el-row type="flex">
        <el-col :span="6" class="align-center" style="min-width:10em">
          <SlImage size="10em" :src="form.src" />
        </el-col>
        <el-col :span="18">
          <el-form-item label="商家SKU编码" prop="merchantSku">
            <el-input v-model="form.merchantSku" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单原需求" prop="requiredNum">
            <el-input
              v-model="form.requiredNum"
              v-slFormatNumber="{ type: 'integer', max: 999999, compareLength: true, includeZero: true }"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="保留需求数" prop="retainRequiredNum">
            <el-input
              v-model="form.retainRequiredNum"
              v-slFormatNumber="retainRequiredNumFormat"
              @input="computeNum"
              placeholder="填写大于0、小于原需求的正整数"
            ></el-input>
          </el-form-item>
          <el-form-item label="拆分需求数" prop="shippedNum">
            <el-input
              v-model="form.shippedNum"
              v-slFormatNumber="{ type: 'integer', max: 999999, compareLength: true, includeZero: true }"
              disabled
              placeholder="拆分需求数=原需求-保留需求"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="sl-dialog-footer">
      <el-button @click="cancel">{{$t('button.cancelText')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('button.submitText')}}</el-button>
    </div>
    <div class="align-center color-text--yellow mt-2rem">(仅支持对原始订单拆单一次，请谨慎操作)</div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SplitOrderDialog',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    inData: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '拆单'
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
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {},
      rules: {
        retainRequiredNum: [
          { required: true, message: '保留需求数', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    showDialog: {
      handler: function (val, oldVal) {
        if (oldVal !== val) {
          this.dialogVisible = val
        }
      },
      immediate: true
    },
    inData: {
      handler: function (val, oldVal) {
        this.form = Object.assign({}, val)
        this.computeNum(this.form.retainRequiredNum)
        if (this.form.retainRequiredNum === 0) { // 为0时,清空该表单项
          this.form.retainRequiredNum = undefined
        }
      },
      immediate: true,
      deep: true
    },
    dialogVisible (val) {
      this.$emit('update:showDialog', val)
    }
  },
  computed: {
    retainRequiredNumFormat () {
      return { type: 'integer', max: this.form.requiredNum ? parseInt(this.form.requiredNum) - 1 : 999999, compareLength: false, includeZero: false }
    }
  },
  methods: {
    computeNum (val) {
      this.form.shippedNum = this.form.requiredNum - val
    },
    cancel () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    submit () {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (this.form.retainRequiredNum > 200 || this.form.shippedNum > 200) {
            this.$confirm('拆单后存在SKU件数大于200，是否确认拆单？').then(() => {
              this.$emit('submit', this.form)
            })
          } else {
            this.$emit('submit', this.form)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sl-dialog-footer {
  text-align: center;
}
</style>
