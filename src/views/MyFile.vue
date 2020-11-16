<template>
  <div class="container">
    <el-card class="personal-records">
      <el-form :model="form" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="账号：">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人：">
              <el-input v-model="form.contactPerson"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话：">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公司地址：">
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
              <el-select v-model="form.supplierType">
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
            <el-form-item label="供应方式：">
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
        <el-button>取 消</el-button>
        <el-button type="primary">保 存</el-button>
      </footer>
    </el-card>
  </div>
</template>

<script>
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
        supplierType: '', // 供应类型
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
      ]
    }
  },
  methods: {
    test () {
      console.log(this.testData)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

  footer {
    margin-top: 5rem;
    display: flex;
    justify-content: center;

    button {
      margin: 0 5rem;
    }
  }
}
</style>
