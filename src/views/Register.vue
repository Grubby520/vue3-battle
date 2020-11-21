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
        <el-form-item label="公司名称" prop="username">
          <el-input v-model="form.username" maxlength="100" clearable placeholder="请填写公司名称"></el-input>
        </el-form-item>

        <el-form-item prop="account">
          <template v-slot:label>
            <span>
              <span class="label-space label-two-space">账号</span>
            </span>
          </template>
          <el-input v-model="form.account" maxlength="100" clearable placeholder="请填写账户"></el-input>
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
            :type="passwordType"
            @focus="passwordFocus"
            clearable
            placeholder="由8-20位数字、字母、符号组成，区分大小写"
          ></el-input>
        </el-form-item>

        <el-form-item prop="contactPerson">
          <template v-slot:label>
            <span>
              <span class="label-space label-three-space">联系人</span>
            </span>
          </template>
          <el-input
            v-model="form.contactPerson"
            minlength="2"
            maxlength="50"
            clearable
            placeholder="请输入联系人信息"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" type="tel" clearable placeholder="请输入11位长度联系电话"></el-input>
        </el-form-item>

        <el-form-item label="公司地址" prop="address">
          <SlAreaCascader v-model="form.address"></SlAreaCascader>
        </el-form-item>

        <el-form-item label prop="detailAddress">
          <el-input v-model="form.detailAddress" maxlength="100" clearable placeholder="请输入详细地址"></el-input>
        </el-form-item>

        <el-form-item label="供应类型" prop="supplierType">
          <el-select v-model="form.supplierType" placeholder="请选择供应类型">
            <el-option
              v-for="(item, index) in supplierTypeOps"
              :key="index"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应方式" prop="supplierMethod">
          <el-select v-model="form.supplierMethod" placeholder="请选择供应方式">
            <el-option
              v-for="(item, index) in supplierMethodOps"
              :key="index"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label>
          <el-button @click="login" :loading="disabled" class="register-btn">返回登录</el-button>
          <el-button type="primary" @click="register" :loading="disabled" class="register-btn">提交注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { emptyValidator, passwordValidator, phoneNoValidator, charLimitValidator } from '@shared/validate'

export default {
  name: 'Register',
  data () {
    return {
      form: {
        username: '', // 公司名称
        account: '', // 账号
        password: '',
        contactPerson: '', // 联系人
        telephone: '', // 联系电话
        address: [], // 公司地址
        detailAddress: '', // 详细地址
        supplierType: 1, // 供应类型
        supplierMethod: 1 // 供应方式
      },
      passwordType: 'text',
      supplierTypeOps: [
        {
          lable: '自有工厂',
          value: 1
        },
        {
          lable: '档口',
          value: 2
        }
      ],
      supplierMethodOps: [
        {
          lable: '非现货',
          value: 1
        },
        {
          lable: '现货',
          value: 2
        }
      ],
      rules: {
        username: [emptyValidator('请填写公司名称', ['blur', 'change'])],
        account: [emptyValidator('请填写账户', ['blur', 'change'])],
        password: [
          emptyValidator('请输入密码', ['blur', 'change']),
          passwordValidator()
        ],
        contactPerson: [
          emptyValidator('请输入联系人信息', ['blur', 'change']),
          charLimitValidator('长度在 2 到 50 个字符', 2, 50, ['blur', 'change'])
        ],
        telephone: [
          emptyValidator('请输入联系电话', ['blur', 'change']),
          phoneNoValidator()
        ],
        address: [
          emptyValidator('请选择公司地址', ['blur', 'change'])
        ],
        supplierType: [
          emptyValidator('请选择供应类型', ['blur', 'change'])
        ],
        supplierMethod: [
          emptyValidator('请选择供应方式', ['blur', 'change'])
        ]
      },
      disabled: false
    }
  },
  methods: {
    login () {
      this.$router.push('login')
    },
    passwordFocus () {
      console.log(1)
      this.passwordType = 'password'
    },
    register () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.disabled = true
          setTimeout(() => {
            this.disabled = false
          }, 3000)
          console.log(this.form)
          // this.submit()
        } else {
          this.$message.error('表单校验未通过，请核对！')
          return false
        }
      })
    },
    submit () {
      this.$message({
        type: 'success',
        message: '注册成功，即将跳转至首页！',
        duration: 2000
      })
      setTimeout(() => {
        this.$router.push('home/index')
      }, 2000)
    }
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
