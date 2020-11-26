<template>
  <div class="odmDetailAttr">
    <p class="odmDetailAttr-title">销售属性</p>
    <div class="odmDetailAttr-form">
      <el-form
        :model="attrForm"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailAttr-form-con"
      >
        <el-form-item label="女装尺码：" prop="productName">
          <el-button type="text" @click="modifyAttr('size')">添加女装尺码</el-button>
        </el-form-item>
        <el-form-item label="颜色" prop="productName">
          <el-button type="text" @click="modifyAttr('color')">添加颜色</el-button>
        </el-form-item>
        <OdmDetailTable></OdmDetailTable>
      </el-form>
      <div v-if="dialogSizes">
        <el-dialog :visible.sync="dialogSizes" width="50%" title="尺码设置" center>
          <OdmDetailAttrSizes v-if="dialogSizes" @closeDialog="closeDialog" @properys="properys" />
        </el-dialog>
      </div>
      <div v-if="dialogColors">
        <el-dialog :visible.sync="dialogColors" width="50%" :title="title" center>
          <OdmDetailAttrColors v-if="dialogColors" @closeDialog="closeDialog" @properys="properys" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import OdmDetailAttrSizes from './OdmDetailAttrSizes'
import OdmDetailAttrColors from './OdmDetailAttrColors'
import OdmDetailTable from './OdmDetailTable'
import { numberValidator, emptyValidator, smallValidator } from '@shared/validate/index'
export default {
  components: { OdmDetailAttrSizes, OdmDetailAttrColors, OdmDetailTable },
  props: {
    isStatus: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      dialogColors: false,
      dialogSizes: false,
      attrForm: {
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
    modifyAttr (attr) {
      console.log(attr)
      if (attr && attr === 'color') {
        this.dialogColors = true
      } else {
        this.dialogSizes = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetailAttr {
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
    &-con {
      width: 90%;
      margin: 40px 0;
    }
  }
}
</style>
