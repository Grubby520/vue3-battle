<template>
  <div class="sl-login-container">
    <div class="sl-login">
      <h3 class="sl-login-title">
        <img src="@/assets/logo.svg" alt="logo" />
        <p>马上发商家系统</p>
      </h3>
      <el-form ref="loginForm" class="sl-login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <span class="form-item-icon" style="top:47%">
            <SlSvgIcon iconClass="icon-sl-user"></SlSvgIcon>
          </span>
          <el-input
            name="username"
            type="text"
            v-model="loginForm.username"
            placeholder="邮箱"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="form-item-icon">
            <SlSvgIcon iconClass="icon-sl-lock"></SlSvgIcon>
          </span>
          <el-input
            name="password"
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <div class="align-center" style="margin-top:7.5rem">
          <el-button
            class="login-button"
            type="primary"
            :loading="isLoading"
            @click="login"
          >{{$t('button.loginText')}}</el-button>
          <p>
            <el-link class="mt-24px" type="primary" @click="register">
              <span class="mr-8px" style="color:#b1b5c1">暂无账号,</span>立即注册
            </el-link>
          </p>
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
        this.$router.push('home/oem-delivery-manage/pending-order-list')
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
$iconDefaultColor: #7c818d;

.sl-login-container {
  height: 100%;
  background-image: url('~@/assets/images/login-bg.png');
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.sl-login-container /deep/ {
  .el-form-item {
    margin-bottom: 3.2rem;
    &.is-error {
      .el-input__inner {
        border: none !important;
      }

      .el-form-item__error {
        margin-top: 0.8rem;
      }
    }
  }

  .el-input {
    border-radius: 0.2rem;
    background-color: $color-white;
  }

  .el-input__inner {
    display: inline-block;
    height: 4.8rem;
    line-height: 4.8rem;
    padding: 0 0.3rem 0 4rem;
    border-radius: 0.2rem;
    color: $color-text-primary;
    background: transparent;
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px $color-white inset !important;
      box-shadow: 0 0 0px 1000px $color-white inset !important;
      -webkit-text-fill-color: $color-text-primary !important;
    }
  }
}

.sl-login-title {
  margin-bottom: 4.8rem;
  font-size: 3.2rem;
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
  top: 50%;
  padding: 1em;
  transform: translate(-50%, -50%);
}

.form-item-icon {
  position: absolute;
  left: 1.4rem;
  top: 50%;
  color: $iconDefaultColor;
  transform: translateY(-50%);
  z-index: 10;
  &:hover {
    color: $color-primary;
  }
}

.login-button {
  width: 100%;
  height: 4.8rem;
  box-shadow: 0px 4px 10px rgba(25, 121, 254, 0.45);
}

.sl-login {
  @include login-responsive-layout;
}
</style>
