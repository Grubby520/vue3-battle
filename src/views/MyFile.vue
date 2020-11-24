<template>
  <div class="container">
    <el-card class="personal-records">
      <el-form :model="form" label-width="110px" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称：" prop="supplierName">
              <el-input v-model="form.supplierName" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="账号：" prop="accountName">
              <el-input v-model="form.accountName" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactName">
              <el-input v-model="form.contactName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话：" prop="contactNumber">
              <el-input v-model="form.contactNumber" type="tel" maxlength="11"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司地址：" prop="address">
              <SlAreaCascader v-model="form.address"></SlAreaCascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司详细地址：" prop="addressDetail">
              <el-input v-model="form.addressDetail" maxlength="100"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应类型：">
              <el-select v-model="form.supplyType" disabled>
                <el-option
                  v-for="(item, index) in supplierTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应方式：" prop="supplierMethod">
              <el-select v-model="form.supplyWay">
                <el-option
                  v-for="(item, index) in supplierWayOptions"
                  :key="index"
                  :label="item.label"
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
import UserApi from '@api/user'
import CommonApi from '@api/api.js'

export default {
  data () {
    return {
      form: {
        supplierName: '', // 公司名称
        accountName: '', // 账号
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
        supplyWay: [
          emptyValidator('请选择供应方式', ['blur', 'change'])
        ]
      },
      loading: true
    }
  },
  mounted () {
    this.getDetails()
    this.getSelection()
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
          let params = {
            ...this.form,
            address: JSON.stringify(this.form.address)
          }
          UserApi.docModify(params).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getSelection () {
      CommonApi.getDict({ dataCode: 'SUPPLY_TYPE' }).then(res => {
        this.supplierTypeOptions = res.data || []
      })
      CommonApi.getDict({ dataCode: 'SUPPLY_WAY' }).then(res => {
        this.supplierWayOptions = res.data || []
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
