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
              <el-input v-model="form.telephone" type="tel"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司地址：" prop="address">
              <SlAreaCascader v-model="form.address"></SlAreaCascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司详细地址：">
              <el-input v-model="form.detailAddress"></el-input>
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
        <el-button type="primary">保 存</el-button>
      </footer>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    let validateTel = (rule, value, callback) => {
      if (!(/^1[3|4|5|7|8]\d{9}$/.test(value))) {
        console.log(1111)
        callback(new Error('请输入正确格式联系电话'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '测试公司名称', // 公司名称
        account: '133333333333', // 账号
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
          { required: true, message: '请输入联系人信息', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        telephone: [
          { validator: validateTel, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请选择公司地址', trigger: 'blur' }
        ],
        supplierMethod: [
          { required: true, message: '请选择供应方式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
