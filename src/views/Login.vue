<template>
<div class="sl-login-container">
    <el-form class="sl-login" :model="loginForm" :rules="loginRules" ref="loginForm"
        label-position="left">
        <div class="title-container">
          <h3 class="title">{{systemName}}</h3>
        </div>
        <el-form-item prop="username">
            <span class="el-icon-s-custom"></span>
            <el-input name="username" type="text" v-model="loginForm.username"
              placeholder="username" />
        </el-form-item>
        <el-form-item prop="password">
            <span class="el-icon-lock"></span>
            <el-input name="password" type="password" v-model="loginForm.password"
                placeholder="password" />
        </el-form-item>
        <el-button ref="loginBtn" type="primary">{{registerText}}</el-button>
        <el-button ref="loginBtn" type="primary" @click="login">{{loginText}}</el-button>
    </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      systemName: 'Starlink  供 应 商 平 台',
      registerText: '注册',
      loginText: '登录',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '账户不能为空',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {

  },
  computed: {
  },
  methods: {
    login () {
      this.$router.push('home')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';

.sl-login-container {
  height: 100%;
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.sl-login {
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 1em;
  transform: translate(-50%,-50%);
}

</style>
