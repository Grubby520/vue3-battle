<template>
  <div class="odmDetailBase">
    <p class="odmDetailBase-title">基本信息</p>
    <div class="odmDetailBase-form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailBase-form-con"
      >
        <el-form-item prop="categoryId" label="商品类目"></el-form-item>
        <el-form-item label="商品标题" prop="productName">
          <el-input
            v-if="isStatus"
            clearable
            v-model.trim="ruleForm.productName"
            placeholder="请输入品牌名称+商品名称"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="供方货号" prop="productName">
          <el-input v-if="isStatus" clearable v-model.trim="ruleForm.itemNo" placeholder="请输入货号" />
        </el-form-item>
        <el-form-item label="预计出货时间">
          <el-radio v-model="ruleForm.hasPattern" :disabled="!isStatus" :label="true">有</el-radio>
          <el-radio v-model="ruleForm.hasPattern" :disabled="!isStatus" :label="false">无</el-radio>
          <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="商品描述" prop="productName">
          <el-input
            v-if="isStatus"
            type="textarea"
            rows="5"
            clearable
            v-model.trim="ruleForm.itemNo"
            placeholder="描述提示：1.务必填写完整的100%面料成分比：例如90%棉、5%氨纶、5%涤纶；2.制作工艺及功能特点、设计创意等。"
          />
        </el-form-item>
        <el-form-item label="商品备注" prop="productName">
          <el-input
            v-if="isStatus"
            type="textarea"
            rows="5"
            clearable
            v-model.trim="ruleForm.itemNo"
            placeholder="描述提示：1.最终商品是否包含图片上的配饰；2.包装后产品重量。3.包装后产品体积 长*宽*高。"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { numberValidator, emptyValidator, smallValidator } from '@shared/validate/index'
export default {
  props: {
    isStatus: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      ruleForm: {
        hasPattern: true
      },
      rules: {
        itemNo: [{ required: true, trigger: 'change' }],
        weight: [numberValidator('请输入0-9999之间的数字', 'blur', true, 4), emptyValidator('预估重量不能为空')],
        productionCycle: [numberValidator('请输入0-999之间的数字', 'blur', false, 3)],
        currentStockAvailableDays: [numberValidator('请输入0-999之间的数字', 'blur', false, 3)],
        stock: [numberValidator('请输入0-999999之间的数字', 'blur', false, 6)],
        supplyPrice: [smallValidator(), emptyValidator('供货单价不能为空')]
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
  margin-bottom: 10px;
  &-title {
    font-size: 15px;
    font-weight: bold;
    color: #a9aaac;
    line-height: 40px;
    margin-left: 30px;
  }
  &-form {
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    &-con {
      width: 90%;
      margin: 40px 0;
    }
  }
}
</style>
