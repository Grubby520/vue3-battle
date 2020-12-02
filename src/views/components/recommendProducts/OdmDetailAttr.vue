<template>
  <div class="odmDetailAttr">
    <p class="odmDetailAttr-title">销售属性</p>
    <div class="odmDetailAttr-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailAttr-form-con"
      >
        <el-form-item label="尺码：" prop="sizeList">
          <sl-select
            v-model="form.sizeList"
            :options="options.size"
            :maxHeight="200"
            filterable
            value="id"
            label="attrTermName"
            multiple
          ></sl-select>
        </el-form-item>

        <el-form-item label="颜色：" prop="colorList">
          <sl-select
            v-model="form.colorList"
            :options="options.color"
            :maxHeight="200"
            filterable
            value="id"
            label="attrTermName"
            multiple
          ></sl-select>
        </el-form-item>
        <OdmDetailTable></OdmDetailTable>
      </el-form>
    </div>
  </div>
</template>

<script>
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import OdmDetailTable from './OdmDetailTable'
import { numberValidator, emptyValidator } from '@shared/validate/index'
export default {
  components: { OdmDetailTable },
  props: {
    isStatus: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      dialogColors: false,
      dialogSizes: false,
      form: {
        hasPattern: true,
        sizeList: [],
        colorList: []
      },
      options: {
        color: [],
        size: []
      },
      rules: {
        sizeList: [{ required: true, trigger: 'change' }],
        colorList: [numberValidator('请输入0-9999之间的数字', 'blur', true, 4), emptyValidator('预估重量不能为空')]
      }
    }
  },
  created () {

  },
  mounted () {
    const getColorList = RecommondApi.getColorList()
    const getSizeList = RecommondApi.getSizeList()
    Promise.all([getSizeList, getColorList]).then((responses) => {
      const sizeResponse = responses[0]
      const colorResponse = responses[1]
      if (sizeResponse.success) {
        this.options.size = sizeResponse.data
      }
      if (colorResponse.success) {
        this.options.color = colorResponse.data
      }
    })
  },
  methods: {
    commmitInfo () {
      return this.form
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
