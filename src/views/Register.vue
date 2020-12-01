<template>
  <div class="register-container">
    <div class="header-container">
      <RegisterHeader></RegisterHeader>
    </div>
    <div class="steps-container clearfix">
      <h2 class="float-left font-wight-normal">商家入驻</h2>
      <Steps :data="steps" :active="activeStep"></Steps>
    </div>
    <el-row>
      <el-col class="register-content" :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
        <keep-alive>
          <component v-bind:is="currentStep"></component>
        </keep-alive>
        <div class="align-center">
          <el-button v-if="activeStep === 1" type="primary">下一步</el-button>
          <el-button v-if="activeStep === 2" type="primary">提交申请</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
import Steps from '@/views/components/register/Steps.vue'
import Application from '@/views/components/register/Application.vue'
import AdditionalInfo from '@/views/components/register/AdditionalInfo.vue'
// import { emptyValidator, passwordValidator, phoneNoValidator, charLimitValidator } from '@shared/validate'
import { valueToMd5 } from '@shared/util'
import UserApi from '@api/user'
import CommonApi from '@api/api.js'
// const { mapState: registerMapState } = createNamespacedHelpers('register')

export default {
  name: 'Register',
  components: {
    RegisterHeader,
    Steps,
    Application,
    AdditionalInfo
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
      supplierTypeOptions: [],
      supplierWayOptions: [],

      isLoading: false
    }
  },
  computed: {
    currentStep () {
      let componentsMap = {
        1: 'Application',
        2: 'AdditionalInfo'
      }
      return componentsMap[this.activeStep]
    }
    // ...registerMapState(['supplierName'])
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    register () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isLoading = true
          UserApi.register({
            ...this.form,
            address: JSON.stringify(this.form.address), // 复写address的值
            password: valueToMd5(this.form.password)// 复写password的值
          }).then(res => {
            if (res.success) {
              this.$refs.form.resetFields()
              this.$message({
                type: 'success',
                message: '注册成功！',
                duration: 2000
              })
              this.goBack()
            }
          }).finally(() => {
            this.isLoading = false
          })
        }
      })
    }
  },
  mounted () {
    CommonApi.getDict({ dataCode: 'SUPPLY_TYPE' }).then(res => {
      this.supplierTypeOptions = res.data || []
    })

    CommonApi.getDict({ dataCode: 'SUPPLY_WAY' }).then(res => {
      this.supplierWayOptions = res.data || []
    })
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

.header-container {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: $color-white;
  z-index: 100;
}

.steps-container {
  position: relative;
  left: 50%;
  width: 50%;
  margin-top: 8rem;
  transform: translateX(-40%);
}

.register-content {
  position: relative;
  left: 50%;
  margin-top: 4em;
  padding: 1em;
  transform: translateX(-50%);
}
</style>
