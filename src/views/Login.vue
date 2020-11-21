<template>
  <div class="sl-login-container">
    <div class="sl-login">
      <h3 class="sl-login-title">{{systemName}}</h3>
      <el-form ref="loginForm" class="sl-login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <span class="el-icon-s-custom form-item-icon"></span>
          <el-input
            name="username"
            type="text"
            v-model="loginForm.username"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="el-icon-lock form-item-icon"></span>
          <el-input
            name="password"
            type="password"
            v-model="loginForm.password"
            placeholder="password"
          />
        </el-form-item>
        <div class="align-center">
          <el-button type="primary" class="mr-2rem" @click="register">{{$t('button.registerText')}}</el-button>
          <el-button type="primary" @click="login">{{$t('button.loginText')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { emptyValidator, passwordValidator, charLimitValidator } from '@shared/validate'
// import { valueToMd5 } from '@shared/util'
// import LoginApi from '@api/login'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          emptyValidator('账户不能为空'),
          charLimitValidator('字符长度不能超过100', 1, 100)
        ],
        password: [
          emptyValidator('密码不能为空'),
          passwordValidator()
        ]
      }
    }
  },
  computed: {
    ...mapState(['systemName'])
  },
  methods: {
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // LoginApi.authLogin({
          //   username: this.loginForm.username,
          //   password: valueToMd5(this.loginForm.password)
          // }).then((res) => {
          //   console.log(res)
          // })
          this.$router.push('home/my-file')
        } else {
          return false
        }
      })
    },
    register () {
      this.$router.push('register')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';

.sl-login-container {
  height: 100%;
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.sl-login-container /deep/ {
  .el-input__inner {
    display: inline-block;
    height: 4rem;
    line-height: 4rem;
    padding: 0 0.3em 0 2em;
  }
}

.sl-login-title {
  margin-bottom: 1em;
  font-size: 2.5rem;
  color: $color-white;
  letter-spacing: 0.2em;
  text-align: center;
}

.sl-login {
  display: inline-block;
  position: absolute;
  width: 25%;
  left: 50%;
  top: 40%;
  padding: 1em;
  transform: translate(-50%, -50%);
}

.form-item-icon {
  position: absolute;
  left: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.sl-login {
  @include login-responsive-layout;
}
</style>
