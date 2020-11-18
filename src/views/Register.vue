<template>
    <div class="sl-login-container">
        <div class="sl-login">
            <h3 class="sl-login-title">注册Starlink供应商平台</h3>
            <el-form ref="form" class="sl-login-form" :model="form" :rules="rules" label-width="12rem">
                <el-form-item label="公司名称：" prop="username">
                    <el-input v-model="form.username" maxlength="100" clearable placeholder="请填写公司名称"></el-input>
                </el-form-item>

                <el-form-item prop="account">
                    <template v-slot:label>
                        <span>
                            <span class="label-space label-two-space">账号</span>：
                        </span>
                    </template>
                    <el-input v-model="form.account" maxlength="100" clearable placeholder="请填写账户"></el-input>
                </el-form-item>

                <el-form-item label="密码：" prop="password">
                    <template v-slot:label>
                        <span>
                            <span class="label-space label-two-space">密码</span>：
                        </span>
                    </template>
                    <el-input v-model="form.password" minlength="8" maxlength="20" type="password" clearable placeholder="由8-20位数字、字母、符号组成，区分大小写"></el-input>
                </el-form-item>

                <el-form-item label="联系人：" prop="contactPerson">
                    <template v-slot:label>
                        <span>
                            <span class="label-space label-three-space">联系人</span>：
                        </span>
                    </template>
                    <el-input v-model="form.contactPerson" minlength="2" maxlength="50" clearable placeholder="请输入联系人信息"></el-input>
                </el-form-item>

                <el-form-item label="联系电话：" prop="telephone">
                    <el-input v-model="form.telephone" type="tel" clearable placeholder="请输入11位长度联系电话"></el-input>
                </el-form-item>

                <el-form-item label="公司地址：" prop="address">
                    <SlAreaCascader v-model="form.address"></SlAreaCascader>
                </el-form-item>

                <el-form-item label prop="detailAddress">
                    <el-input v-model="form.detailAddress" maxlength="100" clearable placeholder="请输入详细地址"></el-input>
                </el-form-item>

                <el-form-item label="供应类型：" prop="supplierType">
                    <el-select v-model="form.supplierType" placeholder="请选择供应类型">
                        <el-option v-for="(item, index) in supplierTypeOps" :key="index" :label="item.lable" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="供应方式：" prop="supplierMethod">
                    <el-select v-model="form.supplierMethod" placeholder="请选择供应方式">
                        <el-option v-for="(item, index) in supplierMethodOps" :key="index" :label="item.lable" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label>
                    <el-button type="primary" size="large" @click="register" :loading="disabled" class="register-btn">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    let validateTel = (rule, value, callback) => {
      if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(value))) {
        callback(new Error('请输入正确格式联系电话'))
      } else {
        callback()
      }
    }
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
        username: [
          { required: true, message: '请填写公司名称', trigger: ['blur', 'change'] }
        ],
        account: [
          { required: true, message: '请填写账户', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { pattern: /^[\S]{8,20}$/, message: '请输入8-20位数字、字母、符号，区分大小写', trigger: ['blur', 'change'] }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人信息', trigger: ['blur', 'change'] },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请选择公司地址', trigger: ['blur', 'change'] }
        ],
        supplierType: [
          { required: true, message: '请选择供应类型', trigger: ['blur', 'change'] }
        ],
        supplierMethod: [
          { required: true, message: '请选择供应方式', trigger: ['blur', 'change'] }
        ]
      },
      disabled: false
    }
  },
  methods: {
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
.sl-login-container {
    height: 100%;
    background-color: $color-login-bg;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.sl-login-container /deep/ {
    .el-input__inner {
        display: inline-block;
        height: 4rem;
        line-height: 4rem;
        padding: 0 0.3em 0 2em;
    }
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

.sl-login-title {
    margin-bottom: 1em;
    font-size: 2.5rem;
    color: $color-white;
    letter-spacing: 0.2em;
    text-align: center;
}

.sl-login {
    display: inline-block;
    position: absolute;
    width: 25%;
    left: 50%;
    top: 45%;
    padding: 1em;
    transform: translate(-50%, -50%);
}

.form-ite-icon {
    position: absolute;
    left: 0.5em;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.register-btn {
    width: 20rem;
    margin-top: 1rem;
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

.sl-login {
    @include login-responsive-layout;
}
</style>
