<template>
  <div class="modify-password-container">
    <div class="modify-password">
      <h3 class="modify-password__title">{{systemName}}</h3>
      <h4 class="modify-password__subtitle">修改密码</h4>
      <el-form
        ref="loginForm"
        class="modify-password__form"
        :model="loginForm"
        :rules="loginRules"
        autocomplete="off"
      >
        <el-form-item prop="oldPassword">
          <span class="el-icon-lock form-ite-icon"></span>
          <el-input
            name="oldPassword"
            type="password"
            v-model="loginForm.oldPassword"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item prop="newPassword">
          <span class="el-icon-lock form-ite-icon"></span>
          <el-input
            name="newPassword"
            type="password"
            v-model="loginForm.newPassword"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <span class="el-icon-lock form-ite-icon"></span>
          <el-input
            name="confirmPassword"
            type="password"
            v-model="loginForm.confirmPassword"
            placeholder="请确认密码"
          />
        </el-form-item>
        <div class="align-center">
          <el-button class="mr-2rem" @click="cancel">{{$t('button.cancelText')}}</el-button>
          <el-button type="primary" @click="submit">{{$t('button.submitText')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'modifyPassword',
  data () {
    return {
      loginForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loginRules: {
        oldPassword: [
          {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['systemName'])
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    submit () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';

.modify-password-container {
  height: 100%;
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.modify-password-container /deep/ {
  .el-input__inner {
    display: inline-block;
    height: 4rem;
    line-height: 4rem;
    padding: 0 0.3em 0 2em;
  }
}

.modify-password {
  display: inline-block;
  position: absolute;
  width: 25%;
  left: 50%;
  top: 40%;
  padding: 1em;
  transform: translate(-50%, -50%);
  @include login-responsive-layout;

  &__title {
    margin-bottom: 1em;
    font-size: 2.5rem;
    color: $color-white;
    letter-spacing: 0.2em;
    text-align: center;
  }

  &__subtitle {
    margin-bottom: 1em;
    font-size: 1.8rem;
    font-weight: 400;
    color: $color-white;
    letter-spacing: 0.2em;
    text-align: center;
  }
}

.form-ite-icon {
  position: absolute;
  left: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
</style>
