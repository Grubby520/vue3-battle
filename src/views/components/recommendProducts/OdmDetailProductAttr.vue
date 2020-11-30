<template>
  <div class="odmDetailProductAttr">
    <p class="odmDetailProductAttr-title">销售属性</p>
    <div class="odmDetailProductAttr-form">
      <el-form
        :model="productttrForm"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailProductAttr-form-con"
      >
        <el-form-item label="颜色" prop="productName"></el-form-item>
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
      dialogColors: false,
      dialogSizes: false,
      productttrForm: {
        hasPattern: true
      },
      rules: {

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
.odmDetailProductAttr {
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
