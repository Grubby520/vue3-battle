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
    <el-form v-if="dialogVisible" ref="dialogForm" :model="form" :rules="rules" label-width="120px">
      <el-row type="flex">
        <el-col :span="6" class="align-center" style="min-width:10em">
          <SlImage size="10em" :src="form.src" />
        </el-col>
        <el-col :span="18">
          <el-form-item label="商家SKU编码" prop="merchantSku">
            <el-input v-model="form.merchantSku" disabled></el-input>
          </el-form-item>
          <el-form-item label="SKU" prop="sku">
            <el-input v-model="form.sku" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单需求量" prop="requiredNum">
            <el-input
              v-model="form.requiredNum"
              v-slFormatNumber="{ type: 'integer', max: 999999, compareLength: true, includeZero: true }"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="缺货类型" prop="type">
            <SlSingleSelect
              label="请选择"
              v-model="form.type"
              :remoteUrl="typeUrl"
              :reqParams="typeParams"
            ></SlSingleSelect>
          </el-form-item>
          <el-form-item label="申请缺货数量" prop="quantity">
            <el-input
              v-model="form.quantity"
              v-slFormatNumber="quantityFormat"
              placeholder="填写大于0、小于原需求的正整数"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              type="textarea"
              rows="2"
              maxlength="50"
              show-word-limit
              clearable
              v-model.trim="form.remarks"
              placeholder="备注"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="sl-dialog-footer">
      <el-button @click="cancel">{{$t('button.cancelText')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('button.submitText')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { emptyValidator } from '@shared/validate'
import CommonUrl from '@api/url.js'

export default {
  name: 'StockOutDialog',
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
      default: '缺货申请'
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
      typeUrl: CommonUrl.dictUrl,
      typeParams: { dataCode: 'STOCK_OUT_TYPE_ENUM' },
      form: {

      },
      rules: {
        type: [
          emptyValidator('缺货类型不能为空')
        ],
        quantity: [
          emptyValidator('缺货数量不能为空')
        ],
        remarks: [
          emptyValidator('备注不能为空')
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
        if (this.form.quantity === 0) { // 为0时,清空该表单项
          this.form.quantity = undefined
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
    quantityFormat () {
      return { type: 'integer', max: this.form.requiredNum ? parseInt(this.form.requiredNum) : 999999, compareLength: false, includeZero: false }
    }
  },
  methods: {
    cancel () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    submit () {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
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
