<template>
  <div class="productImages">
    <el-card class="productImages-card">
      <div slot="header" class="title">
        <span>商品图片</span>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="12rem"
        class="productImages-images form"
      >
        <div class="error-tip">若产品主体超出预览图规范框，则代表该商品不符合规范-仅限产品平铺图，模特图可考虑整体效果。</div>
        <el-form-item prop="images">
          <div class="productImages-images--content">
            <span>*</span>
            <SlUploadImages
              v-model="productImages"
              :imageType="0"
              :limit="1000"
              :multiple="true"
              :disabled="mode"
            />
            <template v-for="(item,index) in [1,2,3,4,5,6,7]">
              <div v-if="index >= productImages.length" :key="item" class="dashed-box align-center">
                <i class="el-icon-plus"></i>
              </div>
            </template>
          </div>
        </el-form-item>
        <p class="error-tip" v-for="(item, index) in hints" :key="index">{{item}}</p>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    const validatorImages = (rule, value, callback) => {
      const _this = this
      if (_this.productImages && _this.productImages.length < 4) {
        callback(new Error('至少上传4张商品图片'))
      } else {
        callback()
      }
    }
    return {
      productImages: [],
      hints: [
        '商品图片注意事项：',
        '1.商品图片必须为商品整体图，图片比例：3：4,宽高值最大尺寸4096px-4096px，最小尺寸100px-100px,大小不超过4M；',
        '2.商品图片建议从正面、侧面、背面，细节各个维度展示商品。至少上传4张图片；'
      ],
      form: {},
      rules: {
        images: [{ required: true, validator: validatorImages }]
      }
    }
  },
  computed: {
    ...mapGetters('product', ['productParams', 'productImagesIInfo']),
    mode () {
      return this.productParams.mode === 'view'
    }
  },
  watch: {
    'productImagesIInfo': {
      handler (newVal) {
        if (newVal && newVal.length > 0) {
          this.productImages = newVal
        }
      },
      deep: true
    }
  },
  methods: {
    result () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.productImages.length > 0) {
              resolve({ 'productImages': this.productImages || [] })
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.productImages {
  $marBottom: 2rem;
  margin-bottom: $marBottom;
  &-card {
    margin-bottom: $marBottom;
  }
  &-images {
    &--content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin: 2rem 0 0 0;
      span {
        color: #f56c6c;
        margin-right: 0.5rem;
      }
    }
    .dashed-box {
      display: inline-block;
      line-height: 11rem;
      width: 11rem;
      height: 11rem;
      border: 1px dashed #c0ccda;
      border-radius: 0.5rem;
      margin: 0 0 2rem 1rem;
      vertical-align: top;
      i {
        font-size: 2rem;
        color: #e0e0e0;
      }
    }
    .error-tip {
      font-size: 1.4rem;
      color: #f56c6c;
      line-height: 2rem;
      margin-bottom: $marBottom;
      padding: 0 12rem;
    }
  }
  /deep/.el-form-item__error {
    top: 93%;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
