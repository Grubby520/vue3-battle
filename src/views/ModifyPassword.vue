<template>
  <div class="modify-password-container">
    <div class="modify-password">
      <h3 class="modify-password__title">{{systemName}}</h3>
      <h4 class="modify-password__subtitle">修改密码</h4>
      <el-form
        ref="form"
        class="modify-password__form"
        :model="form"
        :rules="rules"
        autocomplete="off"
      >
        <div class="mb-1rem color-text--white">旧密码</div>
        <el-form-item prop="oldPassword">
          <span class="el-icon-lock form-item-icon"></span>
          <el-input
            name="oldPassword"
            type="password"
            v-model="form.oldPassword"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <div class="mb-1rem color-text--white">新密码</div>
        <el-form-item prop="newPassword">
          <span class="el-icon-lock form-item-icon"></span>
          <el-input
            name="newPassword"
            type="password"
            v-model="form.newPassword"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <div class="mb-1rem color-text--white">确认密码</div>
        <el-form-item prop="confirmPassword">
          <span class="el-icon-lock form-item-icon"></span>
          <el-input
            name="confirmPassword"
            type="password"
            v-model="form.confirmPassword"
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
import { emptyValidator, passwordValidator, fnValidator } from '@shared/validate/index.js'

export default {
  name: 'ModifyPassword',
  data () {
    let validators = [
      emptyValidator('不能为空'),
      passwordValidator()
    ]
    let sameValueValidator = fnValidator('新密码和确认密码不一致', () => {
      return this.form.newPassword !== this.form.confirmPassword
    })

    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: validators,
        newPassword: validators,
        confirmPassword: [
          ...validators,
          sameValueValidator
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$router.go(-1)
        } else {
          return false
        }
      })
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

.form-item-icon {
  position: absolute;
  left: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
</style>
