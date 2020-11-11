<template>
<div class="w-login-container">
  <form class="w-login">
    <div class="w-form-item" :class="{error:userNameProp.isError && submited}">
      <input type="text" v-model="userNameProp.value" :placeholder="userNameProp.tip">
    </div>
    <div class="w-form-item" :class="{error:passwordProp.isError && submited}">
      <input type="password" v-model="passwordProp.value" :placeholder="passwordProp.tip">
    </div>
    <div class="w-button">
      <button type="button" @click="login" :disabled="!canLogin">{{submitText}}</button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  data () {
    return {
      submitText: '登录',
      submited: false,
      userNameProp: {
        value: '',
        isError: true,
        tip: '用户名'
      },
      passwordProp: {
        value: '',
        isError: true,
        tip: '密码'
      }
    }
  },
  watch: {
    'userNameProp.value': function () {
      this.userNameProp.isError = this.userNameProp.value === ''
    },
    'passwordProp.value': function () {
      this.passwordProp.isError = this.passwordProp.value === ''
    }
  },
  computed: {
    canLogin: function () {
      return !this.userNameProp.isError && !this.passwordProp.isError
    }
  },
  methods: {
    login (event) {
      if (!this.submited) {
        this.submited = true
      }
      if (this.canLogin) {
        this.$router.push('home')
      }
    }
  }
}
</script>

<style scoped lang="scss">
$borderW:1px;
$errorCorlor:#f00;
$fontCorlor:#fff;
$placeholderColor:#ccc;
$black:#000;

.w-login-container {
  height: 100%;
  // background-image: url('/img/bg.jpg');
  background-color: $black;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.w-login {
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 1em;
  transform: translate(-50%,-50%);
}

.w-form-item {
  margin-bottom: 1em;
  &.error {
    input {
      border:$borderW solid $errorCorlor
    }
  }

  input {
    padding: 0.5em;
    width: 20vw;
    font-size: 1.5rem;
    color:$fontCorlor;
    background: transparent;
    border: none;
    box-shadow: 0 0 0.5em #000;
  }
  input::-webkit-input-placeholder {
    color:$placeholderColor;
  }
}

.w-button {
  button {
    width: 10vw;
    padding: 0.3em 0.5em;
    border: none;
    color: $fontCorlor;
    font-size: 1.8rem;
    box-shadow: 0 0 1em;
    background: transparent;
    cursor: pointer;
  }
}

</style>
