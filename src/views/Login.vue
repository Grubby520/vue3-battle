<template>
  <div class="sl-login-container">
    <div class="sl-login">
      <h3 class="sl-login-title">
        <img src="@/assets/login-logo.png" alt="logo" />
      </h3>
      <el-form ref="loginForm" class="sl-login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <span class="el-icon-s-custom form-item-icon"></span>
          <el-input
            name="username"
            type="text"
            v-model="loginForm.username"
            placeholder="邮箱"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="el-icon-lock form-item-icon"></span>
          <el-input
            name="password"
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <div class="align-center">
          <el-button type="primary" class="mr-2rem" @click="register">{{$t('button.registerText')}}</el-button>
          <el-button type="primary" @click="login" :loading="isLoading">{{$t('button.loginText')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

import { createNamespacedHelpers, mapState } from 'vuex'
import { emptyValidator, passwordValidator, charLimitValidator } from '@shared/validate'
import { valueToMd5, getSessionItem } from '@shared/util'
const { mapActions: userMapActions, mapState: userMapState, mapGetters: userMapGetters } = createNamespacedHelpers('user')
const { mapMutations: registerMapMutations } = createNamespacedHelpers('register')

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
          emptyValidator('邮箱不能为空'),
          charLimitValidator('邮箱不正确', 1, 100)
        ],
        password: [
          emptyValidator('密码不能为空'),
          passwordValidator('密码不正确')
        ]
      },
      isLoading: false
    }
  },
  computed: {
    ...mapState(['systemName']),
    ...userMapState(['confirmAgreement']),
    ...userMapGetters(['enterMainPage', 'enterRegisterPage'])
  },
  mounted () {
    this.RESET_USER_DATA()
  },
  methods: {
    ...userMapActions(['AUTH_LOGIN', 'GET_USER_INFO', 'RESET_USER_DATA', 'GET_ROUTES', 'UPDATE_ROUTES']),
    ...registerMapMutations(['RESET_REGISTER_DATA']),
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.AUTH_LOGIN({
            username: this.loginForm.username,
            password: valueToMd5(this.loginForm.password)
          }).then(res => {
            if (res.success) {
              this.GET_USER_INFO().then(data => {
                if (data) {
                  if (this.enterMainPage) {
                    this.UPDATE_ROUTES().then(() => {
                      this.gotoEntryRoute()
                    })
                    return
                  }
                  if (this.enterRegisterPage) {
                    this.$router.push('/register')
                    return
                  }
                  this.$router.push('/registerProgress')
                }
              })
            }
          }).finally(() => {
            this.isLoading = false
          })
        }
      })
    },
    register () {
      this.RESET_REGISTER_DATA()
      this.$router.push({
        path: '/register',
        query: {
          from: 'loginPage'
        }
      })
    },
    gotoEntryRoute () {
      if (getSessionItem('supplierType') === 'OEM') {
        this.$router.push('home/delivery-manage/stay-orders-list')
        return
      }
      this.$router.push('home/recommend-products/list')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';
$inputBgColor: #454545;
$boxShadowColor: rgba(0, 0, 0, 0.7);

.sl-login-container {
  height: 100%;
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.sl-login-container /deep/ {
  .el-input {
    background-color: $inputBgColor;
  }

  .el-input__inner {
    display: inline-block;
    height: 4.5rem;
    line-height: 4.5rem;
    padding: 0 0.3em 0 2em;
    color: $color-white;
    border-radius: 0;
    border: none !important;
    background: transparent;
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px $boxShadowColor inset !important;
      box-shadow: 0 0 0px 1000px $boxShadowColor inset !important;
      -webkit-text-fill-color: #fff !important;
    }
  }
}

.sl-login-title {
  margin-bottom: 1em;
  font-size: 2.5rem;
  color: $color-white;
  letter-spacing: 0.2em;
  text-align: center;
  img {
    height: 12rem;
  }
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
  color: $color-white;
  transform: translateY(-50%);
  z-index: 10;
}

.sl-login {
  @include login-responsive-layout;
}
</style>
