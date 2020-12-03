<template>
  <div class="notify-container">
    <RegisterHeader :supplierName="supplierName" :supplierStatusCode="supplierStatusCode"></RegisterHeader>
    <div class="register-result align-center">
      <span class="el-icon-success"></span>
      <div>
        <div v-if="supplierStatusText && !isSubmit" class="display-inline-block">
          {{supplierStatusText}}&nbsp;&nbsp;
          <el-button v-if="notPassed" type="text" @click.native="toRegister">点击此处重新提交资料</el-button>
        </div>
        <b v-if="isSubmit">
          您的申请已成功提交&nbsp;&nbsp;
          <el-button type="text" @click.native="toLogin">返回登录界面</el-button>
        </b>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
import { getSessionItem } from '@shared/util'
const { mapState: userMapState, mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'Notify',
  components: {
    RegisterHeader
  },
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...userMapState(['supplierName', 'supplierStatusCode', 'confirmAgreement']),
    isSubmit () {
      return this.$route.query.isSubmit
    },
    notPassed () {
      return this.supplierStatusCode === 5
    },
    supplierStatusText () {
      let text = ''
      if ([0, 1].includes(this.supplierStatusCode)) {
        text = '正在审核中'
      }

      if (this.supplierStatusCode === 5) {
        text = '审核未通过'
      }
      return text
    }
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    toRegister () {
      this.$router.push('/register')
    },
    toLogin () {
      this.$router.push('/login')
    }
  },
  mounted () {
    if (getSessionItem('token')) {
      this.GET_USER_INFO()
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';
.notify-container {
  height: 100%;
  background-color: $color-white;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.el-icon-success {
  font-size: 6em;
  color: $color-success;
}

.register-result {
  margin-top: 8rem;
  padding-top: 6em;
}
</style>
