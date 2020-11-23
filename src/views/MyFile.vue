<template>
  <div class="container">
    <el-card class="personal-records">
      <el-form :model="form" label-width="110px" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称：">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="账号：" prop="account">
              <el-input v-model="form.account" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactPerson">
              <el-input v-model="form.contactPerson"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话：" prop="telephone">
              <el-input v-model="form.telephone" type="tel" maxlength="11"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司地址：" prop="address">
              <SlAreaCascader v-model="form.address"></SlAreaCascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司详细地址：">
              <el-input v-model="form.detailAddress" maxlength="100"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应类型：">
              <el-select v-model="form.supplierType" disabled>
                <el-option
                  v-for="(item, index) in supplierTypeOps"
                  :key="index"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应方式：" prop="supplierMethod">
              <el-select v-model="form.supplierMethod">
                <el-option
                  v-for="(item, index) in supplierMethodOps"
                  :key="index"
                  :label="item.lable"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <footer>
        <el-button type="primary" :loading="loading" @click="save">{{$t('button.saveText')}}</el-button>
      </footer>
    </el-card>
  </div>
</template>

<script>
import { emptyValidator, phoneNoValidator, charLimitValidator } from '@shared/validate'
import { successNotify } from '@shared/util/messageUI'
import UserApi from '@api/user'

export default {
  data () {
    return {
      form: {
        name: '', // 公司名称
        account: '', // 账号
        contactPerson: '', // 联系人
        telephone: '', // 联系电话
        address: [], // 公司地址
        detailAddress: '', // 详细地址
        supplierType: 1, // 供应类型
        supplierMethod: '' // 供应方式
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
        supplierMethod: [
          emptyValidator('请选择供应方式', ['blur', 'change'])
        ]
      },
      loading: true
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.loading = true
      UserApi.docDetails().then(res => {
        let { data } = res
        if (data) {
          this.form = {
            ...res.data,
            address: !data.address ? [] : JSON.parse(data.address)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          UserApi.docModify(this.form).then(res => {
            if (res.success) {
              successNotify('保存成功')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

  footer {
    margin-top: 5rem;
    text-align: center;
  }
}
</style>
