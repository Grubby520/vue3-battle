<template>
  <div class="header-container">
    <div class="register-header clearfix">
      <div class="left-module">
        <img src="@/assets/register-logo.png" alt="logo" />
      </div>
      <div class="right-module">
        <div v-if="!supplierStatusCode && supplierStatusCode!== 0">
          <span class="display-inline-block">已有账户</span>&nbsp;
          <el-button type="text" @click="login">快速登录</el-button>
        </div>
        <div class="logined-module" v-else>
          <i class="el-icon-user-solid"></i>
          <span class="text-name display-inline-block text-overflow mr-1rem">{{supplierName}}</span>
          <el-button type="text" @click.native="signOut">退出登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'RegisterHeader',
  props: {
    supplierStatusCode: {
      type: [String, Number],
      default: ''
    },
    supplierName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted: function () {

  },
  methods: {
    ...userMapActions(['SIGN_OUT']),
    login () {
      this.$router.push('/login')
    },
    signOut () {
      this.SIGN_OUT().then(res => {
        if (res) {
          this.login()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
.header-container {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: $color-white;
  z-index: 100;
}

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
      height: 5rem;
      vertical-align: middle;
    }
  }

  .right-module {
    float: right;
    margin-right: 10%;
    & /deep/ {
      .el-button--text {
        font-size: 1.4rem;
      }
    }

    & .logined-module {
      display: flex;
      .el-icon-user-solid {
        line-height: inherit;
        margin-right: 0.2em;
      }

      .text-name {
        max-width: 20em;
      }
    }
  }
}
</style>
