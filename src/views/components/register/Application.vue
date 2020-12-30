<template>
  <div>
    <el-form
      ref="form"
      class="reset-autofill"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="12rem"
      label-position="left"
    >
      <SlContentTitle text="基础信息" line></SlContentTitle>
      <el-form-item label="公司名称" prop="supplierName">
        <el-input
          v-model="form.supplierName"
          maxlength="100"
          clearable
          placeholder="请填写公司名称"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="营业执照号" prop="certificationNo">
        <el-input
          v-model="form.certificationNo"
          maxlength="18"
          clearable
          placeholder="请填写公司营业执照号"
          show-word-limit
        ></el-input>
        <span class="float-right">(如包含字母,字母请大写)</span>
      </el-form-item>
      <el-form-item label="公司性质" prop="supplyType">
        <el-radio-group v-model="form.supplyType" style="line-height:32px">
          <el-radio
            v-for="(item,index) in supplierTypeOptions"
            :key="'radio_'+index"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <SlAreaCascader v-model="form.address"></SlAreaCascader>
      </el-form-item>

      <SlContentTitle text="经营信息" line></SlContentTitle>
      <el-form-item label="主要交易类型" prop="tradeType">
        <el-checkbox-group v-model="form.tradeType">
          <el-checkbox
            v-for="(item,index) in tradeTypeOptions"
            :key="'checkbox_'+index"
            :label="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="年交易额(万元)" prop="annualTurnoverAmount">
        <el-input v-model="form.annualTurnoverAmount" clearable placeholder="万元(￥)"></el-input>
      </el-form-item>
      <el-form-item label="是否自有工厂" prop="selfFactory">
        <el-radio-group v-model="form.selfFactory" @change="selfFactoryChange">
          <el-radio
            v-for="(item,index) in selfFactoryOptions"
            :key="'radio_'+index"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.selfFactory" label="工厂实力" prop="factoryDescription">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="人数、月产能多少件"
          v-model="form.factoryDescription"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="您的优势" prop="advantage">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="若有店铺请在此附上店铺链接"
          v-model="form.advantage"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="现在合作的跨境电商公司" prop="cooperationCompanies">
        <el-checkbox-group v-model="form.cooperationCompanies" style="line-height:32px">
          <el-checkbox
            v-for="(item,index) in cooperationCompanyOptions"
            :key="'checkbox_'+index"
            :label="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 审核拒绝再次编辑时不编辑账号注册模块 -->
      <template v-if="!supplierId">
        <SlContentTitle text="账号注册" line></SlContentTitle>
        <el-form-item label="邮箱" prop="userName">
          <el-input v-model="form.userName" clearable placeholder="用于登录,请务必填写正确的邮箱"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="form.password"
            :type="passwordType"
            minlength="6"
            maxlength="20"
            clearable
            placeholder="必须包含数字、字母组合,不少于6位,不超过20位"
            @focus="passwordTypeChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            :type="passwordType"
            minlength="6"
            maxlength="20"
            clearable
            placeholder="请填写和上面相同的密码"
            @focus="passwordTypeChange"
          ></el-input>
        </el-form-item>
      </template>

      <SlContentTitle text="联系人" line></SlContentTitle>
      <el-form-item label="运营负责人" prop="contactName">
        <el-input
          v-model="form.contactName"
          minlength="2"
          maxlength="20"
          clearable
          show-word-limit
          placeholder="请输入运营负责人"
        ></el-input>
      </el-form-item>
      <el-form-item label="运营手机号" prop="contactNumber">
        <el-input v-model="form.contactNumber" type="tel" clearable placeholder="请输入运营手机号"></el-input>
      </el-form-item>
      <el-form-item label="运营QQ号码" prop="contactQq">
        <el-input v-model="form.contactQq" maxlength="150" clearable placeholder="请输入QQ号码"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { scrollToElFormElement } from '@shared/util'
import {
  emptyValidator,
  passwordValidator,
  phoneNoValidator,
  charLimitValidator,
  businessLicenseNoValidator,
  transactionAamountValidator,
  emailValidator,
  qqValidator,
  fnValidator
} from '@shared/validate'
import CommonApi from '@api/api.js'
import UserApi from '@api/user'
const { mapState: registerMapState, mapMutations: registerMapMutations } = createNamespacedHelpers('register')
const { mapState: userMapState } = createNamespacedHelpers('user')

export default {
  name: 'Application',
  props: {
  },
  data () {
    let sameValueValidator = fnValidator('密码和确认密码不一致', () => {
      return this.form.password && this.form.password !== this.form.confirmPassword
    })

    let supplierNameExistValidator = {
      validator: (rule, value, callback) => {
        UserApi.isSupplierNameExist({ supplierName: value, supplierId: this.supplierId }).then(res => {
          if (res.data) {
            callback(new Error('公司名已存在'))
          } else {
            callback()
          }
        })
      },
      trigger: 'blur'
    }

    let certificationNoExistValidator = {
      validator: (rule, value, callback) => {
        UserApi.isCertificationNoExist({ certificationNo: value, supplierId: this.supplierId }).then(res => {
          if (res.data) {
            callback(new Error('营业执照号已存在'))
          } else {
            callback()
          }
        })
      },
      trigger: 'blur'
    }

    let isUserNameExistValidator = {
      validator: (rule, value, callback) => {
        UserApi.isUserNameExist({ userName: value, userId: this.userId }).then(res => {
          if (res.data) {
            callback(new Error('邮箱已存在'))
          } else {
            callback()
          }
        })
      },
      trigger: 'blur'
    }

    return {
      $passwordType: 'text',
      supplierTypeOptions: [],
      tradeTypeOptions: [],
      cooperationCompanyOptions: [],
      selfFactoryOptions: [],
      form: {
        supplierName: '',
        certificationNo: '', // 营业执照号
        supplyType: null, // 公司性质
        address: [],
        tradeType: [],
        annualTurnoverAmount: null, // 年营业额
        selfFactory: null, // 是否自有工厂
        factoryDescription: '', // 工厂实力
        advantage: '',
        cooperationCompanies: [],
        userName: '',
        password: '',
        confirmPassword: '',
        contactName: '',
        contactNumber: '',
        contactQq: ''
      },
      rules: {
        supplierName: [
          emptyValidator('请填写公司名称'),
          charLimitValidator('字符长度不能超过100', 1, 100),
          supplierNameExistValidator
        ],
        certificationNo: [
          emptyValidator('请填写公司营业执照号'),
          businessLicenseNoValidator('营业执照号不正确'),
          certificationNoExistValidator
        ],
        supplyType: [
          emptyValidator('请选择公司性质', ['blur', 'change'])
        ],
        address: [
          emptyValidator('请选择公司地址', ['blur', 'change'])
        ],
        tradeType: [
          emptyValidator('请选择交易类型', ['blur', 'change'])
        ],
        annualTurnoverAmount: [
          emptyValidator('请选择输入年交易额万元(￥)'),
          transactionAamountValidator('输入有误,请输入0.00-99999999.99之间的数值')
        ],
        selfFactory: [
          emptyValidator('请选择是否自有工厂', ['blur', 'change'])
        ],
        userName: [
          emptyValidator('请填写邮箱'),
          emailValidator(),
          isUserNameExistValidator
        ],
        password: [
          emptyValidator('请输入密码'),
          passwordValidator()
        ],
        confirmPassword: [
          emptyValidator('请输入'),
          passwordValidator(),
          sameValueValidator
        ],
        contactName: [
          emptyValidator('请输入运营联系人'),
          charLimitValidator('长度在 2 到 20 个字符', 2, 20)
        ],
        contactNumber: [
          emptyValidator('请输入运营手机号'),
          phoneNoValidator()
        ],
        contactQq: [
          qqValidator()
        ]
      }
    }
  },
  computed: {
    ...registerMapState(['application', 'supplierId']),
    ...userMapState(['userId']),
    passwordType () {
      return this.form.password ? 'password' : this.$passwordType
    }
  },
  watch: {
    application: {
      handler (val) {
        this.form = Object.assign(this.form, val)
        if (val.selfFactory) {
          this.addFactoryDescriptionValidators()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted: function () {
    CommonApi.getDict({ dataCode: 'SUPPLY_TYPE' }).then(data => {
      this.supplierTypeOptions = data
    })
    CommonApi.getDict({ dataCode: 'TRADE_TYPE' }).then(data => {
      this.tradeTypeOptions = data
    })
    CommonApi.getDict({ dataCode: 'COOPERATION_COMPANY' }).then(data => {
      this.cooperationCompanyOptions = data
    })
    CommonApi.getDict({ dataCode: 'YES_NO' }).then(data => {
      this.selfFactoryOptions = data
    })
  },
  methods: {
    ...registerMapMutations(['SET_APPLICATION']),
    passwordTypeChange () {
      this.$passwordType = 'password'
    },
    selfFactoryChange (val) {
      if (val) {
        this.addFactoryDescriptionValidators()
      } else {
        delete this.rules['factoryDescription']
      }
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.SET_APPLICATION(JSON.parse(JSON.stringify(this.form)))
            resolve(this.form)
          } else {
            resolve(false)
            scrollToElFormElement(this.$refs.form.$el, -50)
          }
        })
      })
    },
    addFactoryDescriptionValidators () {
      let factoryDescriptionValidators = [
        emptyValidator('请描述工厂实力')
      ]
      this.$set(this.rules, 'factoryDescription', factoryDescriptionValidators)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
</style>
