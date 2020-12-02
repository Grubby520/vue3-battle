<template>
  <div class="register-result">
    <div class="align-center">
      <span class="el-icon-success"></span>
      <div>
        <b>您的申请已成功提交</b>
        <div class="display-inline-block">
          {{supplierStatus}}
          <el-button type="text" @click.native="register">点击此处重新提交资料</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterResult',
  props: {
    supplierStatusCode: {
      type: String,
      default: ''
    },
    supplierStatus: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {

    }
  },
  computed: {

  },
  methods: {
    register () {
      this.$router.push('/register')
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
.el-icon-success {
  font-size: 6em;
  color: $color-success;
}

.register-result {
  padding-top: 6em;
}
</style>
