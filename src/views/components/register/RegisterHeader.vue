<template>
  <div class="register-header clearfix">
    <div class="left-module">
      <img src="@/assets/logo.png" alt="logo" />
    </div>
    <div class="right-module">
      已有账户
      <el-button type="text">快速登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterHeader',
  props: {
  },
  data: () => {
    return {

    }
  },
  computed: {

  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';

.register-header {
  position: relative;
  height: 5rem;
  line-height: 5rem;
  background-color: $color-white;
  box-shadow: 0 0 0.5rem $color-gray;
  .left-module {
    float: left;
    margin-left: 20%;
    img {
      height: 3.5rem;
      vertical-align: middle;
    }
  }

  .right-module {
    float: right;
    margin-right: 20%;
    & /deep/ {
      .el-button--text {
        font-size: 1.4rem;
      }
    }
  }
}
</style>
