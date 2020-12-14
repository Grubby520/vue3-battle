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
          maxlength="20"
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
        <el-input
          v-model="form.unionPayNo"
          clearable
          placeholder="请输入银行联行号"
          maxlength="12"
          show-word-limit
        ></el-input>
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
        <el-input
          v-model="form.bankAccount"
          clearable
          placeholder="请输入银行卡号"
          show-word-limit
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item label="法人身份证" prop="idCardImages">
        <el-row>
          <el-col :span="8" style="min-width:120px">
            <UploadImages
              v-model="idCardFronts"
              :folder="certificationNo"
              :imageType="2"
              :imgNumber="1"
              :tools="['download', 'delete']"
              :limits="[{type: 'size',meta: {size: 1}}]"
            ></UploadImages>
            <p>身份证正面</p>
          </el-col>
          <el-col :span="8" style="min-width:120px">
            <UploadImages
              v-model="idCardBacks"
              :folder="certificationNo"
              :imageType="2"
              :imgNumber="1"
              :tools="['download', 'delete']"
              :limits="[{type: 'size',meta: {size: 1}}]"
            ></UploadImages>
            <p>身份证反面</p>
          </el-col>
        </el-row>
        <p>复印件需加盖公章,图片小于1M</p>
      </el-form-item>
      <el-form-item label="营业执照" prop="certificationImage">
        <UploadImages
          ref="certificationImageRef"
          v-model="form.certificationImage"
          :folder="certificationNo"
          :imageType="2"
          :imgNumber="1"
          :tools="['download', 'delete']"
          :limits="[{type: 'size',meta: {size: 1}}]"
        ></UploadImages>
        <p>若已多证合一,请上传最新的营业执照。复印件需加盖公章,图片小于1M</p>
      </el-form-item>
      <el-form-item label="组织机构代码证" prop="organizationImage">
        <UploadImages
          ref="organizationImageRef"
          v-model="form.organizationImage"
          :folder="certificationNo"
          :imageType="2"
          :imgNumber="1"
          :tools="['download', 'delete']"
          :limits="[{type: 'size',meta: {size: 1}}]"
        ></UploadImages>
        <p>若已多证合一,请上传最新的营业执照。复印件需加盖公章,图片小于1M</p>
      </el-form-item>
      <el-form-item label="税务登记证" prop="taxRegisterImage">
        <UploadImages
          ref="taxRegisterImageRef"
          v-model="form.taxRegisterImage"
          :folder="certificationNo"
          :imageType="2"
          :imgNumber="1"
          :tools="['download', 'delete']"
          :limits="[{type: 'size',meta: {size: 1}}]"
        ></UploadImages>
        <p>若已多证合一,请上传最新的营业执照。复印件需加盖公章,图片小于1M</p>
      </el-form-item>
      <el-form-item label="企业股东证截图" prop="companyShareholderImage">
        <UploadImages
          ref="companyShareholderImageRef"
          v-model="form.companyShareholderImage"
          :folder="certificationNo"
          :imageType="2"
          :imgNumber="1"
          :tools="['download', 'delete']"
          :limits="[{type: 'size',meta: {size: 1}}]"
        ></UploadImages>
        <p>国家企业信用信息公示系统截图股东信息。图片小于1M</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import UploadImages from './UploadImages'
import CommonApi from '@api/api.js'
import { scrollToElFormElement } from '@shared/util'
import {
  emptyValidator,
  phoneNoValidator,
  digitalValidator,
  charLimitValidator,
  idCardValidator,
  bankCardNumberValidator
} from '@shared/validate'
const { mapState: registerMapState, mapMutations: registerMapMutations, mapGetters: registerMapGetters } = createNamespacedHelpers('register')

export default {
  name: 'AdditionalInfo',
  components: {
    UploadImages
  },
  props: {
  },
  data () {
    return {
      currencyOptions: [],
      idCardFronts: [],
      idCardBacks: [],
      form: {
        currency: null,
        payeeCompany: '',
        payee: '',
        payeeIdCard: '',
        payeePhone: '',
        unionPayNo: '',
        bank: '',
        bankBranch: '',
        bankAccount: '',
        idCardImages: [],
        certificationImage: [],
        organizationImage: [],
        taxRegisterImage: [],
        companyShareholderImage: []
      },
      rules: {
        currency: [emptyValidator('请选择币种', ['blur', 'change'])],
        payeeCompany: [emptyValidator('请输入收款单位全称')],
        payee: [emptyValidator('请输入收款人姓名'), charLimitValidator('长度在 2 到 20 个字符', 2, 20)],
        payeeIdCard: [emptyValidator('请输入身份证号'), idCardValidator()],
        payeePhone: [emptyValidator('请输入收款人手机号'), phoneNoValidator()],
        unionPayNo: [emptyValidator('请输入位银行联行号'), digitalValidator(), charLimitValidator('银行联行号是12位数字', 12, 12)],
        bank: [emptyValidator('请输入银行开户行'), charLimitValidator('输入字符长度在100以内', 1, 100)],
        bankBranch: [emptyValidator('请输入开户支行'), charLimitValidator('输入字符长度在100以内', 1, 100)],
        bankAccount: [emptyValidator('请输入银行卡号'), bankCardNumberValidator()],
        idCardImages: [emptyValidator('请上传身份证信息'), this.getIdCardImagesValidator()],
        certificationImage: [emptyValidator('请上传营业执照图片', 'change')],
        organizationImage: [emptyValidator('请上传组织结构代码证件图片', 'change')],
        taxRegisterImage: [emptyValidator('请上传税务登记证件图片', 'change')],
        companyShareholderImage: [emptyValidator('请上传企业股东证件图片', 'change')]
      }
    }
  },
  computed: {
    ...registerMapState(['additionalInfo']),
    ...registerMapGetters(['certificationNo'])
  },
  watch: {
    additionalInfo: {
      handler (val) {
        this.form = Object.assign(this.form, val)
        if (this.form.idCardImages.length > 0) {
          this.idCardFronts = [].concat(this.form.idCardImages[0])
          this.idCardBacks = [].concat(this.form.idCardImages[1])
        }
      },
      immediate: true,
      deep: true
    },
    idCardFronts: function (val) {
      this.form.idCardImages[0] = val[0]
      this.$refs.form.validateField('idCardImages')
    },
    idCardBacks: function (val) {
      this.form.idCardImages[1] = val[0]
      this.$refs.form.validateField('idCardImages')
    }
  },
  mounted: function () {
    CommonApi.getDict({ dataCode: 'PAYEE_CURRENCY' }).then(data => {
      this.currencyOptions = data
    })
  },
  methods: {
    ...registerMapMutations(['SET_ADDITIONAL_INFO']),
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.SET_ADDITIONAL_INFO(JSON.parse(JSON.stringify(this.form)))
            resolve(this.form)
          } else {
            resolve(false)
            scrollToElFormElement(this.$refs.form.$el, -50)
          }
        })
      })
    },
    getIdCardImagesValidator () {
      return {
        validator: (rule, value, callback) => {
          let errorMsg = ''
          switch (true) {
            case this.form.idCardImages.length === 0 || (!this.form.idCardImages[0] && !this.form.idCardImages[1]):
              errorMsg = '请上传身份证信息'
              break
            case !this.form.idCardImages[0]:
              errorMsg = '请上传身份证正面信息'
              break
            case !this.form.idCardImages[1]:
              errorMsg = '请上传身份证反面信息'
              break
            case this.form.idCardImages[0].name === this.form.idCardImages[1].name:// 通过图片名称判断是否重复
              errorMsg = '两张图片重复,请重新上传'
              break
          }
          if (errorMsg) {
            callback(new Error(errorMsg))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
</style>
