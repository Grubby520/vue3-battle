<template>
  <div class="register-container">
    <div class="register">
      <h3 class="register-title">注册Starlink供应商平台</h3>
      <el-form
        ref="form"
        class="register-form"
        :model="form"
        :rules="rules"
        label-width="12rem"
        label-position="left"
      >
        <el-form-item label="公司名称" prop="supplierName">
          <el-input v-model="form.supplierName" maxlength="100" clearable placeholder="请填写公司名称"></el-input>
        </el-form-item>

        <el-form-item prop="userName">
          <template v-slot:label>
            <span>
              <span class="label-space label-two-space">账号</span>
            </span>
          </template>
          <el-input v-model="form.userName" maxlength="100" clearable placeholder="请填写账户"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <template v-slot:label>
            <span>
              <span class="label-space label-two-space">密码</span>
            </span>
          </template>
          <el-input
            v-model="form.password"
            minlength="8"
            maxlength="20"
            clearable
            placeholder="由8-20位数字、字母、符号组成，区分大小写"
          ></el-input>
        </el-form-item>

        <el-form-item prop="contactName">
          <template v-slot:label>
            <span>
              <span class="label-space label-three-space">联系人</span>
            </span>
          </template>
          <el-input
            v-model="form.contactName"
            minlength="2"
            maxlength="50"
            clearable
            placeholder="请输入联系人信息"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="form.contactNumber" type="tel" clearable placeholder="请输入11位长度联系电话"></el-input>
        </el-form-item>

        <el-form-item label="公司地址" prop="address">
          <SlAreaCascader v-model="form.address"></SlAreaCascader>
        </el-form-item>

        <el-form-item label prop="addressDetail">
          <el-input v-model="form.addressDetail" maxlength="100" clearable placeholder="请输入详细地址"></el-input>
        </el-form-item>

        <el-form-item label="供应类型" prop="supplyType">
          <el-select v-model="form.supplyType" placeholder="请选择供应类型">
            <el-option
              v-for="(item, index) in supplierTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应方式" prop="supplyWay">
          <el-select v-model="form.supplyWay" placeholder="请选择供应方式">
            <el-option
              v-for="(item, index) in supplierWayOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label>
          <el-button @click="goBack" class="register-btn">{{$t('button.cancelText')}}</el-button>
          <el-button
            type="primary"
            @click="register"
            :loading="isLoading"
            class="register-btn"
          >{{$t('button.submitText')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { emptyValidator, passwordValidator, phoneNoValidator, charLimitValidator } from '@shared/validate'
import { valueToMd5 } from '@shared/util'
import UserApi from '@api/user'
import CommonApi from '@api/api.js'

export default {
  name: 'Register',
  data () {
    return {
      form: {
        supplierName: '', // 公司名称
        userName: '', // 账号
        password: '',
        contactName: '', // 联系人
        contactNumber: '', // 联系电话
        address: [], // 公司地址
        addressDetail: '', // 详细地址
        supplyType: '', // 供应类型
        supplyWay: '' // 供应方式
      },
      supplierTypeOptions: [],
      supplierWayOptions: [],
      rules: {
        supplierName: [emptyValidator('请填写公司名称', ['blur', 'change'])],
        userName: [emptyValidator('请填写账户', ['blur', 'change'])],
        password: [
          emptyValidator('请输入密码', ['blur', 'change']),
          passwordValidator()
        ],
        contactName: [
          emptyValidator('请输入联系人信息', ['blur', 'change']),
          charLimitValidator('长度在 2 到 50 个字符', 2, 50, ['blur', 'change'])
        ],
        contactNumber: [
          emptyValidator('请输入联系电话', ['blur', 'change']),
          phoneNoValidator()
        ],
        address: [
          emptyValidator('请选择公司地址', ['blur', 'change'])
        ],
        supplyType: [
          emptyValidator('请选择供应类型', ['blur', 'change'])
        ],
        supplyWay: [
          emptyValidator('请选择供应方式', ['blur', 'change'])
        ]
      },
      isLoading: false
    }
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
  background-color: $color-login-bg;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.register-container /deep/ {
  .el-form-item__label {
    color: $color-white;
  }
  .el-form-item__content {
    width: 70%;
  }
  .el-select,
  .el-input,
  .el-cascader {
    width: 100%;
  }
}

.register-title {
  margin-bottom: 1em;
  font-size: 2.5rem;
  color: $color-white;
  letter-spacing: 0.2em;
  text-align: center;
}

.register {
  display: inline-block;
  position: absolute;
  width: 25%;
  left: 50%;
  top: 45%;
  padding: 1em;
  transform: translate(-50%, -50%);
}

.register-btn {
  margin-top: 1rem;
  margin-right: 1rem;
}

.label-space {
  display: inline-block;
  width: 5.5rem;
  white-space: nowrap;
  &.label-two-space {
    letter-spacing: 2.6rem;
  }
  &.label-three-space {
    letter-spacing: 0.7rem;
  }
}

.register {
  @include login-responsive-layout;
}
</style>
