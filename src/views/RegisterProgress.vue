<template>
  <div class="register-progress-container">
    <RegisterHeader :supplierName="supplierName"></RegisterHeader>
    <div class="register-result align-center">
      <span class="el-icon-success"></span>
      <div>
        <b v-if="isInvalidStatusCode">您的申请已成功提交</b>
        <div v-else-if="supplierStatusText" class="display-inline-block">
          {{supplierStatusText}}&nbsp;&nbsp;
          <el-button v-if="isRejected" type="text" @click.native="toRegister">点击此处重新提交资料</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
import { getCookie } from '@shared/util'
const { mapState: userMapState, mapActions: userMapActions, mapGetters: userMapGetters } = createNamespacedHelpers('user')

export default {
  name: 'RegisterProgress',
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
    ...userMapState(['supplierName', 'confirmAgreement']),
    ...userMapGetters(['isInvalidStatusCode', 'isRejected', 'isAuditting', 'enterMainPage', 'enterRegisterPage']),
    supplierStatusText () {
      let text = ''
      if (this.isAuditting) {
        text = '正在审核中'
      }

      if (this.isRejected) {
        text = '审核未通过'
      }
      return text
    }
  },
  mounted () {
    if (getCookie('token')) {
      // 刷新页面的场景下确保界面数据正常
      this.GET_USER_INFO().then(data => {
        if (data) {
          if (this.enterMainPage) {
            this.$router.push('home/recommend-products/list')
            return
          }
          if (this.enterRegisterPage) {
            this.$router.push('/register')
          }
        }
      })
    }
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    toRegister () {
      this.$router.push({
        path: '/register',
        query: {
          from: 'registerProgress'
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';
.register-progress-container {
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
