<template>
  <div class="ProductAttr">
    <el-card>
      <div slot="header" class="title">
        <span>商品属性</span>
      </div>
      <div class="form">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="120px"
          class="ProductAttr-form"
        >
          <el-form-item label="女装颜色" prop="nvcolors" class="ProductAttr-input">
            <el-input clearable v-model="form.nvcolors" />
          </el-form-item>
          <el-form-item label="尺寸" prop="sizes" class="ProductAttr-input">
            <el-select>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色" prop="colors">
            <SlSelect
              ref="colorSelect"
              v-model="form.colors"
              :options="options"
              label="attrTermName"
              value="id"
              filterable
              multiple
              clearable
              isObj
              placeholder="请选择颜色"
              @change="selectChange($event, 'color')"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      options: [],
      rules: {}
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    selectChange (e, attribute) {
      this.$refs.form.validateField('colors') // 重新校验表单
    }
  }
}
</script>

<style scoped lang="scss">
.ProductAttr {
  margin-bottom: 2rem;
  &-form {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  &-input {
    width: 334px;
  }
  /deep/.stl-big-data-select .selected-tags {
    width: 210px;
    border: 1px solid #dcdfe6;
  }
  /deep/.el-icon-arrow-down {
    color: #dcdfe6;
  }
}
</style>
