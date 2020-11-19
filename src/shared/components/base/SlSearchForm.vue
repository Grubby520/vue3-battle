<template>
  <div>
    <el-form :model="form" label-width="100px">
      <el-row :gutter="15">
        <el-col
          v-for="(item,index) in items"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="8"
          :xl="6"
          :key="'item_'+index"
        >
          <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.name">
            <el-input
              :placeholder="item.label"
              v-model="form[item.name]"
              @input="formChange"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-else-if="item.type === 'select'" :label="item.label" :prop="item.name">
            <el-select v-model="form[item.name]" placeholder="请选择" clearable>
              <el-option
                v-for="(selectItem,index) in options[item.name]"
                :key="'option_'+index"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
    }
  },
  data () {
    return {
      options: {},
      form: {}
    }
  },
  methods: {
    formChange () {
      this.$emit('valChange', this.form)
    }
  },
  created () {
    this.items.forEach(item => {
      this.$set(this.form, item.name, '')
      if (item.data && item.data.options) {
        this.$set(this.options, item.name, item.data.options)
      }
    })
  },
  mounted () {
    this.formChange()
  }

}
</script>
<style lang="scss">
</style>
