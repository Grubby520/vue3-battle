<template>
  <el-form :model="form" label-width="150px" :rules="rules" ref="form">
    <el-card class="module">
      <SlContentTitle text="收款信息" :fontSize="titleFontSize" :line="false" columnIcon></SlContentTitle>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="收款币种:" prop="bankInfo.currency">
            <template v-if="isView">{{ currencyText }}</template>
            <el-select
              v-else
              v-model="form.bankInfo.currency"
              filterable
              clearable
              placeholder="请选择"
              disabled
              class="form-item"
            >
              <el-option
                v-for="(item,index) in currencyOptions"
                :key="'options-'+index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款单位全称:" prop="bankInfo.payeeCompany">
            <template v-if="isView">{{form.bankInfo.payeeCompany}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.payeeCompany"
              maxlength="100"
              clearable
              disabled
              placeholder="请输入收款单位全称"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照号:" prop="certification.certificationNo">
            <template v-if="isView">{{form.certification.certificationNo}}</template>
            <el-input
              v-else
              v-model="form.certification.certificationNo"
              maxlength="18"
              clearable
              disabled
              placeholder="请填写公司营业执照号"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款方姓名:" prop="bankInfo.payee">
            <template v-if="isView">{{form.bankInfo.payee}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.payee"
              maxlength="20"
              clearable
              disabled
              placeholder="请输入收款人姓名"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码:" prop="bankInfo.payeeIdCard">
            <template v-if="isView">{{form.bankInfo.payeeIdCard}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.payeeIdCard"
              clearable
              disabled
              placeholder="请输入身份证号码"
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行开户行:" prop="bankInfo.bank">
            <template v-if="isView">{{form.bankInfo.bank}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.bank"
              maxlength="100"
              clearable
              disabled
              placeholder="请输入银行开户行"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡号:" prop="bankInfo.bankAccount">
            <template v-if="isView">{{form.bankInfo.bankAccount}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.bankAccount"
              clearable
              disabled
              placeholder="请输入银行卡号"
              show-word-limit
              maxlength="19"
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户支行:" prop="bankInfo.bankBranch">
            <template v-if="isView">{{form.bankInfo.bankBranch}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.bankBranch"
              maxlength="100"
              clearable
              disabled
              placeholder="请输入开户支行"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款方手机号:" prop="bankInfo.payeePhone">
            <template v-if="isView">{{form.bankInfo.payeePhone}}</template>
            <el-input
              v-else
              v-model="form.bankInfo.payeePhone"
              clearable
              disabled
              placeholder="请输入收款方手机号"
              maxlength="11"
              show-word-limit
              class="form-item"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人身份证:">
            <el-row>
              <el-col :span="1" style="min-width:120px">
                <SlImage
                  v-show="form.certification.idCardFront"
                  size="10rem"
                  :src="form.certification.idCardFront"
                />
              </el-col>
              <el-col :span="1" style="min-width:120px">
                <SlImage
                  v-show="form.certification.idCardBack"
                  size="10rem"
                  :src="form.certification.idCardBack"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照:">
            <SlImage
              v-show="form.certification.certificationImage"
              size="10rem"
              :src="form.certification.certificationImage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织机构代码证:">
            <SlImage
              v-show="form.certification.organizationImage"
              size="10rem"
              :src="form.certification.organizationImage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税务登记证:">
            <SlImage
              v-show="form.certification.taxRegisterImage"
              size="10rem"
              :src="form.certification.taxRegisterImage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡正面:">
            <SlImage
              v-show="form.certification.companyShareholderImage"
              size="10rem"
              :src="form.certification.companyShareholderImage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款委托书:">
            <SlImage
              v-show="form.certification.payeeDelegationImage"
              size="10rem"
              :src="form.certification.payeeDelegationImage"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </el-form>
</template>

<script>
import UserApi from '@api/user'
import CommonApi from '@api/api.js'
import { createNamespacedHelpers } from 'vuex'
const { mapState: userMapState } = createNamespacedHelpers('user')

export default {
  name: 'Bank',
  data () {
    return {
      isView: true,
      loading: false,
      titleFontSize: '1.6rem',
      currencyOptions: [],
      form: {
        bankInfo: {
          currency: undefined,
          payeeCompany: null,
          payee: null,
          payeeIdCard: null,
          bank: null,
          bankAccount: null,
          bankBranch: null,
          payeePhone: null
        },
        certification: {
          certificationNo: null,
          certificationImage: null,
          companyShareholderImage: null,
          idCardBack: null,
          idCardFront: null,
          organizationImage: null,
          payeeDelegationImage: null,
          taxRegisterImage: null
        }
      },
      rules: {}
    }
  },
  computed: {
    ...userMapState(['supplierId']),
    currencyText: function () {
      let item = this.currencyOptions.find(item => item.value === this.form.bankInfo.currency)
      return (item && item.label) || ''
    }
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
    CommonApi.getDict({ dataCode: 'PAYEE_CURRENCY' }).then(data => {
      this.currencyOptions = data
    })
  },
  methods: {
    getDetails (supplierId) {
      this.loading = true
      UserApi.getSupplierBankInfo({ supplierId }).then(res => {
        if (res.success) {
          let { bankInfo = {}, certification = {} } = res.data || {}
          this.form.bankInfo = bankInfo
          this.form.certification = certification
        }
      }).finally(() => {
        this.loading = false
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
</style>
