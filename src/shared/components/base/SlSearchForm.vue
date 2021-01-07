<template>
  <div>
    <el-form :model="form" :label-width="`${labelWidth}px`">
      <el-row :gutter="15">
        <el-col v-if="$slots.before" :span="24">
          <slot name="before"></slot>
        </el-col>
        <el-col
          v-for="(item,index) in items"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="8"
          :xl="6"
          :key="'item_'+index"
        >
          <el-form-item
            v-if="item.type === 'input'"
            :label="item.isLabel? '':item.label"
            :prop="item.name"
          >
            <el-input
              :placeholder="item.label"
              v-model="form[item.name]"
              @input="formChange"
              clearable
            ></el-input>
          </el-form-item>
          <template v-else-if="item.type === 'single-select'">
            <el-form-item
              :label="item.isLabel? '':item.label"
              :prop="item.name"
              :class="{'block':item.data.isBlock}"
            >
              <SlSingleSelect
                :label="item.isLabel?item.label:'请选择'"
                v-model="form[item.name]"
                :remoteUrl="item.data.remoteUrl"
                :reqParams="item.data.params"
                :options="options[item.name]"
              ></SlSingleSelect>
            </el-form-item>
          </template>
          <!-- 树型下拉 -->
          <template v-else-if="item.type === 'tree-select'">
            <el-form-item
              :label="item.isLabel? '':item.label"
              :prop="item.name"
              :class="{'block':item.data.isBlock}"
            >
              <SlTreeSelect
                v-model="form[item.name]"
                :options="options[item.name]"
                :label="item.isLabel?item.label:'请选择'"
              ></SlTreeSelect>
            </el-form-item>
          </template>
          <template v-else-if="item.type === 'date'">
            <el-form-item
              :label="item.isLabel? '':item.label"
              :prop="item.name"
              :class="{'block':item.data.isBlock}"
            >
              <el-date-picker
                v-model="form[item.name]"
                :type="item.data.datetype"
                placeholder="选择日期"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'SlSearchForm',
  model: {
    prop: 'modelVal',
    event: 'valChange'
  },
  props: {
    modelVal: {
      type: Object,
      required: true,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      options: {},
      resetForm: {},
      form: {}
    }
  },
  methods: {
    formChange () {
      this.$emit('valChange', this.form)
    },
    reset () {
      this.form = JSON.parse(JSON.stringify(this.resetForm))
      this.$emit('valChange', this.form)
    }
  },
  created () {
    this.form = Object.assign({}, JSON.parse(JSON.stringify(this.modelVal)))
    this.items.forEach(item => {
      /// 判断入参是否有设置默认值。
      /// 若有就取传入的默认值。
      /// 若没有，则根据是否是多选设置默认值。
      const defaultValue = item.hasOwnProperty('default') ? item.default : item.isMultivalued ? [] : ''
      this.$set(this.form, item.name, defaultValue)
      if (item.data && item.data.options) {
        this.$set(this.options, item.name, item.data.options)
      }
    })
    // 保存初始表单值
    Object.keys(this.form).forEach(key => {
      this.resetForm[key] = this.form[key]
    })
  },
  mounted () {
    this.formChange()
  }

}
</script>
<style lang="scss">
.block /deep/ {
  .el-select {
    display: block;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
