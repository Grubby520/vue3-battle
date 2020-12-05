<template>
  <div class="odmDetailBase">
    <p class="odmDetailBase-title">基本信息</p>
    <div class="odmDetailBase-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="130px"
        class="odmDetailBase-form-con"
      >
        <el-form-item
          label="商品类目"
          prop="categoryId"
        >{{cateLabels ? cateLabels :this.form.categoryName }}</el-form-item>
        <el-form-item label="商品标题" prop="title">
          <el-input
            clearable
            v-model.trim="form.title"
            placeholder="1.商品标题：品牌名称+商品名称。2.标题字数仅限20个字以内"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="供方货号" prop="supplierItemNo">
          <el-input
            clearable
            v-model.trim="form.supplierItemNo"
            maxlength="100"
            placeholder="请输入供方货号"
          />
        </el-form-item>
        <el-form-item label="预计出货时间" prop="estimatedShippingTime">
          <el-radio v-model="hasPattern" :label="true" @input="changeToSpot">
            现货
            <span style="color: #ff0000;">（今日可发货）</span>
          </el-radio>
          <el-radio v-model="hasPattern" :label="false">期货</el-radio>
          <el-date-picker
            v-model="form.estimatedShippingTime"
            type="date"
            placeholder="选择预计出货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="hasPattern"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-if="!isStatus"
            type="textarea"
            rows="5"
            clearable
            maxlength="500"
            show-word-limit
            v-model.trim="form.description"
            placeholder="描述提示：1.务必填写完整的100%面料成分比：例如90%棉、5%氨纶、5%涤纶；2.制作工艺及功能特点、设计创意等。"
          />
          <p v-else>{{form.description}}</p>
        </el-form-item>
        <el-form-item label="商品备注" prop="remark">
          <el-input
            v-if="!isStatus"
            type="textarea"
            rows="5"
            clearable
            v-model.trim="form.remark"
            placeholder="描述提示：1.最终商品是否包含图片上的配饰；2.包装后产品重量。3.包装后产品体积 长*宽*高。"
          />
          <p v-else>{{form.remark}}</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import RecommondApi from '@api/recommendProducts/recommendProducts.js'

import { isEmpty } from '@shared/util'
export default {
  props: {
    id: { type: String, required: false, default: '' },
    isStatus: { type: Boolean, required: false, default: false },
    productBasicInfo: { type: Object, required: false, default: () => { } },
    // 分类Id
    categoryId: {
      type: [String, Number],
      default: ''
    },
    cateLabels: { type: String, required: false, default: '' }
  },
  data () {
    const productValidata = (rule, value, callback) => {
      if (this.form.supplierItemNo) {
        RecommondApi.checkItem(this.form.supplierItemNo)
          .then(res => {
            if (res.success) {
              callback()
            } else {
              callback(new Error('同一个供应商下，供方SPU唯一'))
            }
          })
      } else {
        callback(new Error('不能为空'))
      }
    }
    return {
      hasPattern: false,
      form: {
        // 分类编号
        categoryId: '',
        // 商品标题
        title: '',
        // 供方货号
        supplierItemNo: '',
        // 预计出货类型
        // hasPattern: true,
        // 预计出货时间
        estimatedShippingTime: '',
        // 商品描述
        description: '',
        // 商品备注
        remark: '',
        categoryName: '',
        supplyType: undefined,
        id: this.id
      },
      rules: {
        categoryId: [{ required: true }],
        title: [{ required: true, message: '请输入品牌名称+商品名称', trigger: 'blur' }],
        supplierItemNo: [{ required: true, validator: productValidata, trigger: 'change' }],
        estimatedShippingTime: [this.ShippingTimeValidator()],
        description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入商品备注', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created () {

  },
  mounted () {
    const label = this.cateLabels.split('>')
    this.form.categoryName = label[label.length - 1]
  },
  watch: {
    'productBasicInfo': {
      handler (newValue) {
        for (let key of Object.keys(newValue)) {
          if (Object.prototype.hasOwnProperty.call(this.form, key)) {
            this.form = newValue
            this.form[key] = newValue[key]
            if (newValue.supplyType !== 0) {
              this.hasPattern = false
            } else {
              this.hasPattern = true
            }
          }
        }
        this.form.categoryId = this.categoryId
      },
      immediate: true
    }
  },
  methods: {
    changeToSpot () {
      this.form.estimatedShippingTime = ''
      this.$refs.form.clearValidate('estimatedShippingTime')
    },
    commmitInfo () {
      const _this = this
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.hasPattern) {
              _this.$set(_this.form, 'estimatedShippingTime', _this.$moment(new Date()).format('YYYY-MM-DD'))
              _this.form.supplyType = 0
            } else {
              _this.form.supplyType = 1
            }
            const label = _this.cateLabels.split('>')
            _this.form.categoryName = label[label.length - 1]
            Object.assign(this.productBasicInfo, _this.form)
            resolve({ 'productBasicInfo': this.productBasicInfo })
          } else {
            reject(new Error())
          }
        })
      })
    },
    ShippingTimeValidator () {
      return {
        required: true,
        validator: (rule, value, callback) => {
          if (this.hasPattern) {
            callback()
          } else if (isEmpty(value)) {
            callback(new Error('请选择预计出货时间'))
          } else {
            callback()
          }
        },
        message: '请选择预计出货时间',
        trigger: 'blur'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetailBase {
  margin-bottom: 1rem;
  &-title {
    padding: 0 20px;
    font-weight: bold;
    font-size: 1.8rem;
    line-height: 5rem;
  }
  &-form {
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    &-con {
      width: 90%;
      margin: 0 auto;
      padding: 2rem 0;
    }
  }
}
</style>
