<template>
  <div class="register-container">
    <RegisterHeader :supplierName="supplierName" :supplierStatusCode="supplierStatusCode"></RegisterHeader>
    <div class="register-content-container">
      <div class="steps-container clearfix">
        <h2 class="float-left font-wight-normal mr-2rem">商家入驻</h2>
        <Steps :data="steps" :active="activeStep"></Steps>
      </div>
      <el-row>
        <el-col class="register-content" :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
          <keep-alive>
            <component ref="currentComponent" v-bind:is="currentStep"></component>
          </keep-alive>
          <!-- 前两步才会有的结构 -->
          <div v-if="activeStep <= 2" class="align-center">
            <el-button v-if="activeStep === 1" @click="toLogin()">{{$t('button.cancelText')}}</el-button>
            <el-button type="primary" :disabled="isLoading" @click="goStep()">{{stepText}}</el-button>
            <el-button
              v-if="activeStep === 2"
              type="primary"
              :loading="isLoading"
              @click="register"
            >提交申请</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
import Steps from '@/views/components/register/Steps.vue'
import Application from '@/views/components/register/Application.vue'
import AdditionalInfo from '@/views/components/register/AdditionalInfo.vue'
import Protocol from '@/views/components/register/Protocol.vue'
import UserApi from '@api/user'
import { getCookie, scrollToTop } from '@shared/util'
const { mapState: userMapState, mapActions: userMapActions, mapGetters: userMapGetters } = createNamespacedHelpers('user')
const { mapGetters: registerMapGetters, mapMutations: registerMapMutations } = createNamespacedHelpers('register')

export default {
  name: 'Register',
  components: {
    RegisterHeader,
    Steps,
    Application,
    AdditionalInfo,
    Protocol
  },
  data () {
    return {
      steps: [
        {
          title: '提交入驻申请'
        },
        {
          title: '补充资质信息'
        },
        {
          title: '补充确认协议'
        }
      ],
      activeStep: 1,
      isLoading: false
    }
  },
  computed: {
    ...userMapState(['supplierId', 'supplierName', 'supplierStatusCode']),
    ...userMapGetters(['statusInfo', 'enterMainPage']),
    ...registerMapGetters(['getSubmitData']),
    currentStep () {
      let componentsMap = {
        1: 'Application',
        2: 'AdditionalInfo',
        3: 'Protocol'
      }

      return componentsMap[this.activeStep]
    },
    stepText () {
      let stepTextMap = {
        1: '下一步',
        2: '上一步'
      }
      return stepTextMap[this.activeStep]
    }
  },
  watch: {
    statusInfo: {
      handler (val) {
        if (!val.confirmAgreement && val.supplierStatusCode === 2) {
          this.activeStep = 3
        }
      },
      immediate: true
    }
  },
  methods: {
    ...userMapActions(['GET_USER_INFO']),
    ...registerMapMutations(['SET_APPLICATION', 'SET_ADDITIONAL_INFO', 'SET_SUPPLIER_ID']),
    goStep () {
      let stepMap = {
        1: 2,
        2: 1
      }
      if (this.activeStep === 1) {
        this.$refs.currentComponent.validate().then((data) => {
          if (data) {
            this.activeStep = stepMap[this.activeStep]
            scrollToTop()
          }
        })
        return
      }
      this.activeStep = stepMap[this.activeStep]
      scrollToTop()
    },
    toLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    transformImageData (url) {
      return {
        url
      }
    },
    transformBackData (data) {
      let { baseInfo = {}, bankInfo = {}, certification = {} } = data
      let application = {}
      let additionalInfo = {}
      // 申请入驻信息回填
      application = {
        address: baseInfo.address ? JSON.parse(baseInfo.address) : [],
        tradeType: baseInfo.tradeType ? JSON.parse(baseInfo.tradeType) : [],
        certificationNo: certification.certificationNo
      }
      Object.keys(baseInfo).forEach(key => {
        if (!['address', 'tradeType'].includes(key)) {
          application[key] = baseInfo[key]
        }
      })
      // 资质信息回填
      let idCardImages = []
      if (certification.idCardFront) {
        idCardImages[0] = this.transformImageData(certification.idCardFront)
      }
      if (certification.idCardBack) {
        idCardImages[1] = this.transformImageData(certification.idCardBack)
      }
      additionalInfo = {
        idCardImages
      }
      Object.keys(certification).forEach(key => {
        if (!['idCardFront', 'idCardBack', 'certificationNo'].includes(key)) {
          additionalInfo[key] = certification[key] ? [this.transformImageData(certification[key])] : []
        }
      })
      Object.keys(bankInfo).forEach(key => {
        additionalInfo[key] = bankInfo[key]
      })

      this.SET_APPLICATION(application)
      this.SET_ADDITIONAL_INFO(additionalInfo)
    },
    register () {
      this.$refs.currentComponent.validate().then((data) => {
        if (data) {
          this.isLoading = true
          let apiMethod = this.supplierId ? 'registerUpdate' : 'register'
          UserApi[apiMethod](this.getSubmitData).then(res => {
            if (res.success) {
              this.$router.push({
                path: '/notify',
                query: {
                  msgType: 'register-submit-success'
                }
              })
            }
          }).finally(() => {
            this.isLoading = false
          })
        }
      })
    }
  },
  mounted () {
    if (getCookie('token')) {
      // 通过路由参数区分是从哪个页面来到注册页的
      let fromPage = this.$route.query.from
      if (fromPage === 'loginPage') {
        return
      }
      this.GET_USER_INFO().then(res => {
        if (res) {
          if (this.enterMainPage) {
            this.$router.push('home/recommend-products/list')
            return
          }
          if ([0, 1].includes(this.supplierStatusCode)) {
            this.$router.push('/registerProgress')
            return
          }

          if (this.supplierStatusCode === 5) {
            if (fromPage !== 'registerProgress') {
              this.$router.push('/registerProgress')
              return
            }
            this.SET_SUPPLIER_ID(this.supplierId)
            UserApi.getSupplierDetail({ supplierId: this.supplierId }).then(res => {
              if (res.success) {
                this.transformBackData(res.data)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';
.register-container {
  height: 100%;
  background-color: $color-white;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.register-container /deep/ {
  .el-select,
  .el-cascader {
    display: block;
  }
}

.register-content-container {
  margin-top: 8rem;
}

.steps-container {
  position: relative;
  display: flex;
  left: 50%;
  width: 50%;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}

.register-content {
  position: relative;
  left: 50%;
  margin-top: 1em;
  padding: 1em;
  transform: translateX(-50%);
}
</style>
