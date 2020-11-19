<template>
  <div class="modifyPropery">
    <el-divider />
    <el-input
      v-for="(pro,index) in modifyPro"
      :key="index"
      v-model.trim="modifyPro[index]"
      clearable
      class="modifyPropery__input"
    />
    <div class="modifyPropery__icon" @click="add">
      <i class="el-icon-plus" />
    </div>
    <el-divider />
    <div class="flex-center">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: { type: String, required: false, default: '' }
  },
  data () {
    return {
      modifyPro: []
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    add () {
      this.modifyPro.push('')
    },
    cancel () {
      this.$emit('closeDialog', false)
    },
    save () {
      this.$emit('properys', false, this.status, this.modifyPro)
    }
  }
}
</script>

<style scoped lang="scss">
.modifyPropery {
  position: relative;
  &__input {
    margin: 10px 0;
  }
  &__icon {
    border: 1px dashed #dcdfe6;
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
    padding: 5px 0;
  }
}
</style>
