<template>
  <div class="ProductBase">
    <el-card>
      <div slot="header" class="title">
        <span>基本信息</span>
      </div>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <el-form-item
            label="商品类目"
            prop="categoryId"
          >{{productParams.cateLabels ? productParams.cateLabels :form.categoryName }}</el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input
              clearable
              v-model.trim="form.name"
              placeholder="商品名称字数仅限20个字以内"
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
          <el-form-item label="品牌" prop="brand">
            <el-input clearable v-model.trim="form.brand" placeholder="请填写品牌" maxlength="20" />
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
          <el-form-item label="商品备注">
            <el-input
              v-if="!isStatus"
              type="textarea"
              rows="5"
              maxlength="500"
              show-word-limit
              clearable
              v-model.trim="form.remark"
              placeholder="描述提示：1.最终商品是否包含图片上的配饰；2.包装后产品重量。3.包装后产品体积 长*宽*高。"
            />
            <p v-else>{{form.remark}}</p>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import RecommondApi from '@api/recommendProducts/recommendProducts.js'
import { mapGetters } from 'vuex'
export default {
  props: {
    isStatus: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      hasPattern: false,
      form: {
        // 分类编号
        categoryId: '',
        // 商品标题
        title: '',
        // 供方货号
        supplierItemNo: '',
        // 商品描述
        description: '',
        // 商品备注
        remark: '',
        categoryName: '',
        id: ''
      },
      rules: {
        categoryId: [{ required: true }],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        supplierItemNo: [this.productValidata()],
        brand: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'productbasic'])
  },
  watch: {
    'productbasic': {
      handler (newValue) {
        const keys = Object.keys(newValue)
        if (keys.length > 0) {
          for (let key of keys) {
            // 判断传入的数据是否都是当前页面需要的参数
            if (Object.prototype.hasOwnProperty.call(this.form, key)) {
              this.form = newValue
              this.form[key] = newValue[key]
            }
          }
        }
        this.form.categoryId = newValue.categoryId
      },
      immediate: true
    }
  },
  mounted () {
    this.form.categoryId = this.productParams.categoryId
    this.$refs.form.validateField('categoryId')
  },
  methods: {
    result () {
      return new Promise((resolve, reject) => {
        Object.assign(this.productbasic, this.form)
        resolve({ 'productbasic': this.productbasic || [] })
      })
    },
    productValidata () {
      return {
        required: true,
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('供方货号不能为空'))
          } else {
            if (value === this.supplierItemNo) {
              callback()
            } else {
              RecommondApi.checkItem(value)
                .then(res => {
                  if (res.data) {
                    callback(new Error('同一个供应商下，供方SPU唯一'))
                  } else {
                    callback()
                  }
                })
            }
          }
        },
        trigger: 'blur'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ProductBase {
  margin-bottom: 2rem;
}
</style>
