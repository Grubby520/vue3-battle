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
      <OdmDetailSizeConfig @hide="hideDialog" ref="sizeConfig"></OdmDetailSizeConfig>
      <OdmDetailColorConfig @hide="hideDialog" ref="colorConfig"></OdmDetailColorConfig>
    </div>
  </div>
</template>

<script>
import OdmDetailSizeConfig from './OdmDetailSizeConfig'
import OdmDetailColorConfig from './OdmDetailColorConfig'
import OdmDetailTable from './OdmDetailTable'
import { numberValidator, emptyValidator, smallValidator } from '@shared/validate/index'
export default {
  components: { OdmDetailSizeConfig, OdmDetailColorConfig, OdmDetailTable },
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
      let configRef = null
      let data = null
      switch (attr) {
        case 'size':
          configRef = this.$refs.sizeConfig
          data = []
          break
        case 'color':
          configRef = this.$refs.colorConfig
          data = []
          break
      }
      // 弹窗开启统一调用的地方
      configRef.open(data)
    },
    /**
     * 弹窗关闭时响应
     * @param {String} type 弹窗类型
     * @param {Object} data 弹窗返回的数据
     */
    hideDialog (type, data) {

    }
  }
}
</script>

<style scoped lang="scss">
.odmDetailAttr {
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
    &-con {
      width: 90%;
      margin: 0 auto;
      padding: 2rem 0;
    }
  }
}
</style>
