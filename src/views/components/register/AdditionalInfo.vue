<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="12rem" label-position="left">
      <SlContentTitle text="收款信息" line></SlContentTitle>
      <el-form-item label="收款币种" prop="currency">
        <el-select v-model="form.currency" filterable clearable placeholder="请选择">
          <el-option
            v-for="(item,index) in currencyOptions"
            :key="'options-'+index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款单位全称" prop="payeeCompany">
        <el-input
          v-model="form.payeeCompany"
          maxlength="100"
          clearable
          placeholder="请输入收款单位全称"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="收款方姓名" prop="payee">
        <el-input
          v-model="form.payee"
          maxlength="50"
          clearable
          placeholder="请输入收款人姓名"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="payeeIdCard">
        <el-input v-model="form.payeeIdCard" clearable placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <el-form-item label="收款方手机号" prop="payeePhone">
        <el-input
          v-model="form.payeePhone"
          clearable
          placeholder="请输入收款方手机号"
          maxlength="11"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="银行联行号" prop="unionPayNo">
        <el-input v-model="form.unionPayNo" clearable placeholder="请输入银行联行号"></el-input>
      </el-form-item>
      <el-form-item label="银行开户行" prop="bank">
        <el-input
          v-model="form.bank"
          maxlength="100"
          clearable
          placeholder="请输入银行开户行"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="开户支行" prop="bankBranch">
        <el-input
          v-model="form.bankBranch"
          maxlength="100"
          clearable
          placeholder="请输入开户支行"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankAccount">
        <el-input v-model="form.bankAccount" clearable placeholder="请输入银行卡号"></el-input>
      </el-form-item>
      <el-form-item label="法人身份证" prop="idCardImages">
        <SlUploadImages
          ref="uploadImages"
          v-model="form.idCardImages"
          :imageUrls="idCardImages"
          :imageType="0"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import {
  emptyValidator,
  phoneNoValidator,
  digitalValidator,
  charLimitValidator,
  idCardValidator,
  bankCardNumberValidator
} from '@shared/validate'
const { mapState: registerMapState, mapActions: registerMapActions } = createNamespacedHelpers('register')

export default {
  name: 'AdditionalInfo',
  props: {
  },
  data: () => {
    return {
      currencyOptions: [],
      idCardImages: [],
      form: {
        currency: '',
        payeeCompany: '',
        payee: '',
        payeeIdCard: '',
        payeePhone: '',
        unionPayNo: '',
        bank: '',
        bankBranch: '',
        bankAccount: '',
        idCardImages: [],
        certificationImage: '',
        // idCardFront: '',
        // idCardBack: '',
        organizationImage: '',
        taxRegisterImage: '',
        companyShareholderImage: ''
      },
      rules: {
        currency: [emptyValidator('请选择币种')],
        payeeCompany: [emptyValidator('请输入收款单位全称')],
        payee: [emptyValidator('请输入收款人姓名'), charLimitValidator('长度在 2 到 50 个字符', 2, 50)],
        payeeIdCard: [emptyValidator('请输入身份证号'), idCardValidator()],
        payeePhone: [emptyValidator('请输入收款人手机号'), phoneNoValidator()],
        unionPayNo: [emptyValidator('请输入位银行联行号'), digitalValidator(), charLimitValidator('银行联行号是12位数字', 12, 12)],
        bank: [emptyValidator('请输入银行开户行'), charLimitValidator('输入字符长度在100以内', 1, 100)],
        bankBranch: [emptyValidator('请输入开户支行'), charLimitValidator('输入字符长度在100以内', 1, 100)],
        bankAccount: [emptyValidator('请输入银行卡号'), bankCardNumberValidator()],
        idCardImages: [emptyValidator('请上传身份证证件图片')],
        certificationImage: [emptyValidator('请上传营业执照图片')],
        organizationImage: [emptyValidator('请上传组织结构代码证件图片')],
        taxRegisterImage: [emptyValidator('请上传税务登记证件图片')],
        companyShareholderImage: [emptyValidator('请上传企业股东证件图片')]
      }
    }
  },
  computed: {
    ...registerMapState(['additionalInfo'])
  },
  watch: {
    additionalInfo: {
      handler (val) {
        this.form = Object.assign(this.form, val)
      },
      immediate: true,
      deep: true
    }
  },
  mounted: function () {
    this.currencyOptions = [
      {
        label: '人民币',
        value: 1
      }, {
        label: '港币',
        value: 2
      }, {
        label: '美元',
        value: 3
      }
    ]
  },
  methods: {
    ...registerMapActions(['SET_ADDITIONAL_INFO']),
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.SET_ADDITIONAL_INFO(JSON.parse(JSON.stringify(this.form)))
            resolve(this.form)
          } else {
            reject(new Error(false))
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
</style>
