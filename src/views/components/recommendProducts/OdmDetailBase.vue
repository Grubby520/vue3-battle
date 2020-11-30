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
        <el-form-item label="商品类目"></el-form-item>
        <el-form-item label="商品标题" prop="productName">
          <el-input
            v-if="isStatus"
            clearable
            v-model.trim="form.productName"
            placeholder="请输入品牌名称+商品名称"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="供方货号" prop="itemNo">
          <el-input
            v-if="isStatus"
            clearable
            v-model.trim="form.itemNo"
            maxlength="100"
            placeholder="请输入供方货号"
          />
        </el-form-item>
        <el-form-item label="预计出货时间" prop="time">
          <el-radio v-model="form.hasPattern" :disabled="!isStatus" :label="true">
            现货
            <span style="color: #ff0000;">（今日可发货）</span>
          </el-radio>
          <el-radio v-model="form.hasPattern" :disabled="!isStatus" :label="false">期货</el-radio>
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="选择预计出货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品描述" prop="productDescription">
          <el-input
            v-if="isStatus"
            type="textarea"
            rows="5"
            clearable
            maxlength="500"
            show-word-limit
            v-model.trim="form.productDescription"
            placeholder="描述提示：1.务必填写完整的100%面料成分比：例如90%棉、5%氨纶、5%涤纶；2.制作工艺及功能特点、设计创意等。"
          />
        </el-form-item>
        <el-form-item label="商品备注" prop="productMask">
          <el-input
            v-if="isStatus"
            type="textarea"
            rows="5"
            clearable
            v-model.trim="form.productMask"
            placeholder="描述提示：1.最终商品是否包含图片上的配饰；2.包装后产品重量。3.包装后产品体积 长*宽*高。"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isStatus: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      form: {
        // 商品标题
        productName: '',
        // 供方货号
        itemNo: '',
        // 预计出货类型
        hasPattern: true,
        // 预计出货时间
        time: '',
        // 商品描述
        productDescription: '',
        // 商品备注
        productMask: ''
      },
      rules: {
        productName: [{ required: true, message: '请输入品牌名称+商品名称', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请输入供方货号', trigger: 'blur' }],
        time: [{ required: true, message: '请选择预计出货时间', trigger: 'blur' }],
        productDescription: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
        productMask: [{ required: true, message: '请输入商品备注', trigger: 'blur' }]
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
