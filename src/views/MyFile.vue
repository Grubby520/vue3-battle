<template>
  <el-form :model="form" label-position="left" label-width="100px" :rules="rules" ref="form">
    <el-card class="module">
      <SlContentTitle text="基础信息" :fontSize="titleFontSize" :line="false" columnIcon></SlContentTitle>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公司名称" prop="baseInfo.supplierName">
            <el-input v-model="form.baseInfo.supplierName" disabled class="form-item"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司地址" prop="baseInfo.address">
            <SlAreaCascader v-model="form.baseInfo.address" disabled class="form-item"></SlAreaCascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="baseInfo.userName">
            <el-input v-model="form.baseInfo.userName" disabled class="form-item"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商ID" prop="baseInfo.erpSupplierId">
            <el-input v-model="form.baseInfo.erpSupplierId" disabled class="form-item"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="module">
      <SlContentTitle text="联系人" :fontSize="titleFontSize" :line="false" columnIcon></SlContentTitle>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="baseInfo.contactName">
            <el-input
              v-model.trim="form.baseInfo.contactName"
              class="form-item"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营手机号" prop="baseInfo.contactNumber">
            <el-input
              v-model.trim="form.baseInfo.contactNumber"
              type="tel"
              maxlength="11"
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营QQ号码" prop="baseInfo.contactQq">
            <el-input
              v-model.trim="form.baseInfo.contactQq"
              maxlength="15"
              clearable
              placeholder="请输入QQ号码"
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人微信" prop="baseInfo.contactWebChat">
            <el-input
              v-model.trim="form.baseInfo.contactWebChat"
              maxlength="15"
              clearable
              placeholder="请输入联系人微信"
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="module">
      <SlContentTitle text="退货信息" :fontSize="titleFontSize" :line="false" columnIcon></SlContentTitle>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="退货地址" prop="shippingAddress.provinces">
            <SlAreaCascader v-model="form.shippingAddress.provinces" class="form-item"></SlAreaCascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="shippingAddress.address">
            <el-input
              v-model="form.shippingAddress.address"
              maxlength="200"
              show-word-limit
              placeholder="请填写详细收货地址"
              clearable
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收件人" prop="shippingAddress.contactName">
            <el-input
              v-model.trim="form.shippingAddress.contactName"
              maxlength="20"
              show-word-limit
              placeholder="请填写收件人"
              clearable
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="shippingAddress.contactCellphone">
            <el-input
              v-model.trim="form.shippingAddress.contactCellphone"
              type="tel"
              maxlength="11"
              placeholder="请填写收件人电话号码"
              clearable
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="固定电话" prop="shippingAddress.contactTelephone">
            <el-input
              v-model.trim="form.shippingAddress.contactTelephone"
              clearable
              maxlength="20"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <footer>
      <el-button type="primary" :loading="loading" @click="save">{{$t('button.saveText')}}</el-button>
    </footer>
  </el-form>
</template>

<script>
import { emptyValidator, phoneNoValidator, charLimitValidator, telePhoneValidator } from '@shared/validate'
import { scrollToElFormElement } from '@shared/util'
import UserApi from '@api/user'
import { createNamespacedHelpers } from 'vuex'
const { mapState: userMapState } = createNamespacedHelpers('user')

export default {
  name: 'MyFile',
  data () {
    return {
      loading: false,
      titleFontSize: '1.6rem',
      form: {
        baseInfo: {
          supplierName: null, // 公司名称
          userName: null, // 邮箱
          address: [], // 地址
          contactName: null,
          contactNumber: null,
          contactQq: null,
          contactWebChat: null // 微信号
        },
        shippingAddress: {
          address: null, // 详细地址
          provinces: [], // 省市区
          contactCellphone: null, // 手机号
          contactTelephone: '', // 固定号
          contactName: null
        }
      },
      rules: {
        baseInfo: {
          contactName: [
            emptyValidator('请输入联系人'),
            charLimitValidator('长度在 2 到 20 个字符', 2, 20)
          ],
          contactNumber: [
            emptyValidator('请输入运营手机号'),
            phoneNoValidator()
          ],
          address: [
            emptyValidator('请选择公司地址', ['blur', 'change'])
          ]
        },
        shippingAddress: {
          address: [
            emptyValidator('请填写详细地址', 'blur')
          ],
          provinces: [
            emptyValidator('请选择公司地址', ['blur', 'change'])
          ],
          contactCellphone: [
            emptyValidator('请输入手机号'),
            phoneNoValidator()
          ],
          contactName: [emptyValidator('请输入收件人')],
          contactTelephone: [telePhoneValidator()]
        }
      }
    }
  },
  computed: {
    ...userMapState(['supplierId'])
  },
  watch: {
    supplierId: {
      handler (val, oldVal) {
        if (val) {
          this.getDetails(val)
        }
      },
      immediate: true
    }
  },
  mounted () {

  },
  methods: {
    getDetails (supplierId) {
      this.loading = true
      UserApi.getSupplierBasicInfo({ supplierId }).then(res => {
        if (res.success) {
          let { baseInfo = {}, shippingAddress = {} } = res.data || {}
          baseInfo = baseInfo || {}
          shippingAddress = shippingAddress || {}
          this.form.baseInfo = {
            supplierName: baseInfo.supplierName,
            userName: baseInfo.userName,
            address: baseInfo.address ? JSON.parse(baseInfo.address) : [],
            contactName: baseInfo.contactName,
            contactNumber: baseInfo.contactNumber,
            contactQq: baseInfo.contactQq,
            contactWebChat: baseInfo.contactWebChat
          }

          this.form.shippingAddress = {
            address: shippingAddress.address,
            provinces: shippingAddress.provinces ? JSON.parse(shippingAddress.provinces) : [],
            contactCellphone: shippingAddress.contactCellphone,
            contactTelephone: shippingAddress.contactTelephone || '',
            contactName: shippingAddress.contactName
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
            provinces: this.form.shippingAddress.provinces ? JSON.stringify(this.form.shippingAddress.provinces) : null,
            address: this.form.shippingAddress.address.trim(),
            recipientName: this.form.shippingAddress.contactName,
            recipientCellphone: this.form.shippingAddress.contactCellphone,
            recipientTelephone: this.form.shippingAddress.contactTelephone,
            contactName: this.form.baseInfo.contactName,
            contactNumber: this.form.baseInfo.contactNumber,
            contactQq: this.form.baseInfo.contactQq,
            contactWebChat: this.form.baseInfo.contactWebChat
          }
          UserApi.supplierUpdate(params).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.getDetails(this.supplierId)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          scrollToElFormElement(this.$refs.form.$el, undefined, function (errorItemDom) {
            errorItemDom.scrollIntoView({
              behavior: 'smooth'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module {
  margin-bottom: 1.5em;
  .form-item {
    width: 60%;
  }
}

footer {
  margin-top: 5rem;
  text-align: center;
}
</style>
