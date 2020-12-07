<template>
  <div class="notify-container">
    <RegisterHeader :supplierName="supplierName" :supplierStatusCode="supplierStatusCode"></RegisterHeader>
    <div class="register-result align-center">
      <span class="el-icon-success"></span>
      <div>
        <div v-if="supplierStatusText && !isSubmitMsg" class="display-inline-block">
          {{supplierStatusText}}&nbsp;&nbsp;
          <el-button v-if="notPassed" type="text" @click.native="toRegister">点击此处重新提交资料</el-button>
        </div>
        <b v-if="isSubmitMsg">您的申请已成功提交</b>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
import { getCookie, isEmpty } from '@shared/util'
const { mapState: userMapState, mapActions: userMapActions, mapGetters: userMapGetters } = createNamespacedHelpers('user')

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
    ...userMapGetters(['enterMainPage']),
    isSubmitMsg () {
      return this.$route.query.msg === 'submit'
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
  mounted () {
    if (getCookie('token')) {
      // 刷新页面的场景下确保界面数据正常
      this.GET_USER_INFO().then(data => {
        if (data) {
          if (this.enterMainPage) {
            this.$router.push('home/recommend-products/list')
          }
          if (!isEmpty(this.supplierStatusCode)) {
            this.$router.replace({
              path: '/notify',
              query: {}
            }).catch(() => { })
          }
        }
      })
    }
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    toRegister () {
      this.$router.push('/register')
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
