<template>
  <div class="maintain">
    <div class="maintain__base">
      <p class="maintain__base-baseTitle">基本信息</p>
      <el-divider />
      <el-form :model="ruleForm" :rules="rules" ref="form" label-width="130px">
        <el-row type="flex" justify="center" class="maintain__form">
          <el-col :span="11">
            <el-form-item prop="categoryName" label="分类">
              <SlCategory v-model="ruleForm.categoryId" />
            </el-form-item>
            <el-form-item label="商品名称" prop="productName">
              <el-input
                clearable
                v-model.trim="ruleForm.productName"
                placeholder="请输入商品名称"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item prop="images" label="商品图片">
              <SlUploadImages v-model="uploadImageUrl" :imageUrls="imageUrls" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="itemNo" label="供方货号">
              <el-input
                clearable
                v-model.trim="ruleForm.itemNo"
                placeholder="请输入供应货号"
                maxlength="100"
              />
            </el-form-item>
            <el-form-item prop="weight" label="预估重量">
              <el-input clearable v-model.trim="ruleForm.weight" placeholder="请输入预估重量" />
            </el-form-item>
            <el-form-item prop="supplyPrice" label="供货价格">
              <el-input clearable v-model.trim="ruleForm.supplyPrice" placeholder="请输入供货单价" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="maintain__other">
          <p class="maintain__other-baseTitle">其他信息</p>
          <el-divider />
          <div class="maintain__other-modify">
            <div class="flex-left">
              <p style="margin-right:10px">颜色</p>
              <i class="el-icon-edit" @click="modifyDialog(1)" />
            </div>
            <div class="flex-left spans">
              <p v-for="(color,coIndex) in colors" :key="coIndex">{{color}}</p>
            </div>
            <div class="flex-left">
              <p style="margin-right:10px">尺码</p>
              <i class="el-icon-edit" @click="modifyDialog(2)" />
            </div>
            <div class="flex-left spans">
              <p v-for="(size, siIndex) in sizes" :key="siIndex">{{size}}</p>
            </div>
            <div class="flex-left checkbox">
              <p>成份</p>
              <el-input
                clearable
                v-model.trim="ruleForm.ingredient"
                maxlength="50"
                style="width:31%;"
              />
            </div>
            <div class="flex-left checkbox">
              <p>是否有现货</p>
              <el-radio v-model="ruleForm.isSpot" :label="true">有</el-radio>
              <el-radio v-model="ruleForm.isSpot" :label="false">无</el-radio>
              <el-form-item prop="type" label="生产周期">
                <el-input-number
                  v-model.trim="ruleForm.productionCycle"
                  controls-position="right"
                  :min="1"
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item prop="type" label="库存数量">
                <el-input clearable v-model.trim="ruleForm.stock" />
              </el-form-item>
              <el-form-item prop="type" label="当前库存可维持">
                <el-input clearable v-model.trim="ruleForm.currentStockAvailableDays" />
              </el-form-item>
              <p>{{'天'}}</p>
            </div>
            <div class="flex-left checkbox">
              <p>是否有版</p>
              <el-radio v-model="ruleForm.hasPattern" :label="true">有</el-radio>
              <el-radio v-model="ruleForm.hasPattern" :label="false">无</el-radio>
              <el-form-item prop="type" label="打版周期">
                <el-input-number
                  v-model="ruleForm.makePatternCycle"
                  controls-position="right"
                  :min="1"
                  maxlength="255"
                  style="width:100%"
                />
              </el-form-item>
            </div>
            <div class="flex-left checkbox">
              <p>尺码表</p>
              <SlUploadImages v-model="uploadSizeUrl" :imageUrls="imageSizeUrls" />
            </div>
          </div>
          <div></div>
        </div>
      </el-form>
      <SlBaseDetails
        ref="control"
        :references="$refs"
        form="form"
        :mode="mode"
        :load="load"
        :modify="modify"
        :gotoList="gotoList"
        :isRight="true"
        saveText="保存"
        cancelText="取消"
      />
    </div>
    <div v-if="dialog">
      <el-dialog :visible.sync="dialog" width="30%" :title="title">
        <ModifyPropery @closeDialog="closeDialog" @properys="properys" :status="status" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ModifyPropery from './ModifyPropery'
import { numberValidator } from '@shared/validate/index'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'

export default {
  components: { ModifyPropery },
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: Number, required: false, default: undefined }
  },
  data () {
    return {
      dialog: false,
      title: '',
      status: '',
      ruleForm: {},
      colors: [],
      sizes: [],
      uploadImageUrl: [],
      imageUrls: [],
      imageSizeUrls: [],
      uploadSizeUrl: [],
      rules: {
        categoryName: [
          { required: true, message: '', trigger: 'change' }
        ],
        // productName: [
        //   { required: true, message: '', trigger: 'blur' }
        // ],
        images: [
          { required: true, message: '', trigger: 'change' }
        ],
        itemNo: [
          { required: true, message: '', trigger: 'change' }
        ],
        weight: [
          numberValidator()
        ],
        supplyPrice: [
          { required: true, message: '', trigger: 'change' }
        ]
        // weight: [
        //   { required: false, validator: 'numberValidator', trigger: 'blur' }
        // ]
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    load () {
      // 获取接口详情信息
      RecommondApi.recommendDetail(this.id)
        .then((res) => {
          console.log(res.data)
          this.ruleForm = res.data
          const { productImageList, sizeImageList, color, size } = res.data
          const IMAGEURLS = []
          const IMAGESIZEURLS = []
          // 商品图片回显
          productImageList.forEach((img) => {
            IMAGEURLS.push({ url: img.imageUrl, ossPath: img.ossPath })
          })
          // 尺码图片回显
          sizeImageList.forEach((size) => {
            IMAGESIZEURLS.push({ url: size.imageUrl, ossPath: size.ossPath })
          })
          // 颜色回显
          this.colors = color.split(',')
          // 尺码回显
          this.sizes = size.split(',')
          console.log(IMAGESIZEURLS)
          this.imageUrls = IMAGEURLS
          this.imageSizeUrls = IMAGESIZEURLS
        })
        .catch(() => {

        })
    },
    modify () {
      // 编辑页面
      this.ruleForm.size = this.sizes.join(',')
      this.ruleForm.color = this.colors.join(',')
    },
    gotoList () {
      // 取消返回列表
      this.$router.back()
    },
    modifyDialog (pro) {
      this.title = pro === 1 ? '修改颜色' : '修改尺码'
      this.status = pro === 1 ? 'color' : 'size'
      this.dialog = true
    },
    closeDialog (val) {
      this.dialog = val
    },
    properys (val, status, properys) {
      // 修改颜色和尺寸
      this.dialog = val
      if (status !== 'color') {
        this.sizes.push(...properys)
      } else {
        this.colors.push(...properys)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.maintain {
  padding: 20px;
  $boder: 1px solid #dcdfe6;
  .title {
    font-size: 15px;
    font-weight: bold;
    color: #a9aaac;
    line-height: 40px;
    margin-left: 10px;
  }
  .checkbox {
    /deep/.el-form-item {
      margin-bottom: 0 !important;
    }
    /deep/ .el-checkbox-group {
      font-size: unset !important;
    }
    margin-top: 10px;
    P {
      margin-right: 10px;
      width: 100px;
    }
    p:last-child {
      margin-left: 10px;
    }
  }
  .spans {
    border: $boder;
    height: 32px;
    width: 53%;
    line-height: 32px;
    border-radius: 4px;
    p {
      background-color: #eff3f7;
      padding: 0px 10px;
      text-align: center;
      border-radius: 4px;
      line-height: 20px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  &__base {
    border: $boder;
    &-baseTitle {
      @extend .title;
    }
  }
  &__form {
    border-bottom: $boder;
  }
  &__other {
    border-top: unset;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    &-baseTitle {
      @extend .title;
    }
    &-modify {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  /deep/.el-divider--horizontal {
    margin: 0 0 24px 0;
  }
  /deep/.el-dialog__title {
    font-size: 15px;
  }
}
</style>
