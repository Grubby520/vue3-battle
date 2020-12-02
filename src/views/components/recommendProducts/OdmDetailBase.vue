<template>
  <div class="odmDetailBase">
    <p class="odmDetailBase-title">基本信息</p>
    <div class="odmDetailBase-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailBase-form-con"
      >
        <el-form-item label="商品类目">{{cateLabels}}</el-form-item>
        <el-form-item label="商品标题" prop="title">
          <el-input clearable v-model.trim="form.title" placeholder="请输入品牌名称+商品名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="供方货号" prop="itemNo">
          <el-input clearable v-model.trim="form.itemNo" maxlength="100" placeholder="请输入供方货号" />
        </el-form-item>
        <el-form-item label="预计出货时间" prop="estimatedShippingTime">
          <el-radio v-model="hasPattern" :label="true" @input="resetValidate">
            现货
            <span style="color: #ff0000;">（今日可发货）</span>
          </el-radio>
          <el-radio v-model="hasPattern" :label="false">期货</el-radio>
          <el-date-picker
            v-model="form.estimatedShippingTime"
            type="date"
            placeholder="选择预计出货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="hasPattern"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            type="textarea"
            rows="5"
            clearable
            maxlength="500"
            show-word-limit
            v-model.trim="form.description"
            placeholder="描述提示：1.务必填写完整的100%面料成分比：例如90%棉、5%氨纶、5%涤纶；2.制作工艺及功能特点、设计创意等。"
          />
        </el-form-item>
        <el-form-item label="商品备注" prop="remark">
          <el-input
            type="textarea"
            rows="5"
            clearable
            v-model.trim="form.remark"
            placeholder="描述提示：1.最终商品是否包含图片上的配饰；2.包装后产品重量。3.包装后产品体积 长*宽*高。"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { isEmpty } from '@shared/util'
export default {
  props: {
    isStatus: { type: Boolean, required: false, default: false },
    id: { type: String, required: false, default: '' },
    categoryId: { type: Number, required: false, default: undefined },
    cateLabels: { type: String, required: false, default: '' }
  },
  data () {
    return {
      hasPattern: true,
      form: {
        // 商品标题
        title: '',
        // 供方货号
        itemNo: '',
        // 预计出货类型
        // hasPattern: true,
        // 预计出货时间
        estimatedShippingTime: '',
        // 商品描述
        description: '',
        // 商品备注
        remark: '',
        categoryId: this.categoryId
      },
      rules: {
        title: [{ required: true, message: '请输入品牌名称+商品名称', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请输入供方货号', trigger: 'blur' }],
        estimatedShippingTime: [this.ShippingTimeValidator()],
        description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入商品备注', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    resetValidate () {
      this.$refs.form.clearValidate('estimatedShippingTime')
    },
    commmitInfo () {
      if (this.hasPattern) {
        this.$set(this.from, 'estimatedShippingTime', this.$moment(new Date()).format('YYYY-M-D HH:mm'))
      }
      return this.form
    },
    ShippingTimeValidator () {
      return {
        validator: (rule, value, callback) => {
          // if (this.hasPattern) {
          //   callback()
          // } else if (isEmpty(value)) {
          //   callback(new Error('请选择预计出货时间'))
          // } else {
          //   callback()
          // }
        },
        message: '请选择预计出货时间',
        trigger: 'blur'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetailBase {
  margin-bottom: 1rem;
  &-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #a9aaac;
    line-height: 4rem;
    margin-left: 3rem;
  }
  &-form {
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    &-con {
      width: 90%;
      margin: 0 auto;
      padding: 2rem 0;
    }
  }
}
</style>
