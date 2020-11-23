<template>
  <div class="maintain">
    <div class="maintain__base">
      {{uploadImageUrl}}
      <p class="maintain__base-baseTitle">基本信息</p>
      <el-divider />
      <el-form :model="ruleForm" :rules="rules" ref="form" label-width="130px">
        <el-row type="flex" justify="center" class="maintain__form">
          <el-col :span="11">
            <el-form-item prop="categoryName" label="分类">
              <SlCategory v-model="ruleForm.categoryId" v-if="mode==='modify'" />
              <div v-else>{{ruleForm.categoryId}}</div>
            </el-form-item>
            <el-form-item label="商品名称" prop="productName">
              <el-input
                v-if="mode==='modify'"
                clearable
                v-model.trim="ruleForm.productName"
                placeholder="请输入商品名称"
                maxlength="255"
              />
              <div v-else>{{ruleForm.productName}}</div>
            </el-form-item>
            <el-form-item label="商品图片" v-model="ruleForm.productImageList">
              <SlUploadImages
                ref="uploadImages"
                v-model="uploadImageUrl"
                :imageUrls="imageUrls"
                :imageType="0"
                @deleteImages="deleteImages"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="itemNo" label="供方货号">
              <el-input
                v-if="mode==='modify'"
                clearable
                v-model.trim="ruleForm.itemNo"
                placeholder="请输入供应货号"
                maxlength="100"
              />
              <div v-else>{{ruleForm.itemNo}}</div>
            </el-form-item>
            <el-form-item prop="weight" label="预估重量">
              <el-input
                v-if="mode==='modify'"
                clearable
                v-model.trim="ruleForm.weight"
                placeholder="请输入预估重量"
              />
              <div v-else>{{ruleForm.weight}}</div>
            </el-form-item>
            <el-form-item prop="supplyPrice" label="供货价格">
              <el-input
                v-if="mode==='modify'"
                clearable
                v-model.trim="ruleForm.supplyPrice"
                placeholder="请输入供货单价"
                @blur="blur(ruleForm.supplyPrice)"
              />
              <div v-else>{{ruleForm.supplyPrice}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="maintain__other">
          <p class="maintain__other-baseTitle">其他信息</p>
          <el-divider />
          <div class="maintain__other-modify">
            <div class="flex-left">
              <p style="margin-right:10px">颜色</p>
              <i class="el-icon-edit" @click="modifyDialog(1)" v-if="mode==='modify'" />
            </div>
            <div class="flex-left spans">
              <p v-for="(color,coIndex) in colors" :key="coIndex">{{color}}</p>
            </div>
            <div class="flex-left">
              <p style="margin-right:10px">尺码</p>
              <i class="el-icon-edit" @click="modifyDialog(2)" v-if="mode==='modify'" />
            </div>
            <div class="flex-left spans">
              <p v-for="(size, siIndex) in sizes" :key="siIndex">{{size}}</p>
            </div>
            <div class="flex-left checkbox">
              <p>成份</p>
              <el-input
                v-if="mode==='modify'"
                clearable
                v-model.trim="ruleForm.ingredient"
                maxlength="50"
                style="width:31%;"
              />
              <div v-else>{{ruleForm.ingredient}}</div>
            </div>
            <div class="flex-left checkbox">
              <p>是否有现货</p>
              <el-radio v-model="ruleForm.isSpot" :label="true">有</el-radio>
              <el-radio v-model="ruleForm.isSpot" :label="false">无</el-radio>
              <el-form-item prop="productionCycle" label="生产周期">
                <el-input-number
                  v-if="mode==='modify'"
                  v-model.trim="ruleForm.productionCycle"
                  controls-position="right"
                  :min="1"
                  style="width:100%"
                />
                <div v-else>{{ruleForm.productionCycle}}</div>
              </el-form-item>
              <el-form-item prop="stock" label="库存数量">
                <el-input v-if="mode==='modify'" clearable v-model.trim="ruleForm.stock" />
                <div v-else>{{ruleForm.stock}}</div>
              </el-form-item>
              <el-form-item prop="currentStockAvailableDays" label="当前库存可维持">
                <el-input
                  v-if="mode==='modify'"
                  clearable
                  v-model.trim="ruleForm.currentStockAvailableDays"
                />
                <div v-else>{{ruleForm.currentStockAvailableDays}}</div>
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
                  v-if="mode==='modify'"
                  controls-position="right"
                  :min="1"
                  maxlength="255"
                  style="width:100%"
                  :precision="1"
                  :step="0.1"
                  :max="999.9"
                />
                <div v-else>{{ruleForm.makePatternCycle}}</div>
              </el-form-item>
            </div>
            <div class="flex-left checkbox">
              <p>尺码表</p>
              <SlUploadImages
                ref="uploadSizeImages"
                v-model="uploadSizeUrl"
                :imageUrls="imageSizeUrls"
                :imageType="1"
              />
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
import uploadApi from '@api/api'
import { numberWeightValidator, numberProductionValidator, emptyValidator, numberStockValidator, smallValidator } from '@shared/validate/index'
import RecommondApi from '@api/recommendProducts/recommendProducts.js'

export default {
  components: { ModifyPropery },
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: String, required: false, default: '' }
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
      delImages: [],
      rules: {
        categoryName: [
          [emptyValidator('分类不能为空')]
        ],
        images: [
          { required: true, message: '', trigger: 'change' }
        ],
        itemNo: [
          { required: true, message: '', trigger: 'change' }
        ],
        weight: [numberWeightValidator(), emptyValidator('预估重量不能为空')],
        productionCycle: [numberProductionValidator()],
        currentStockAvailableDays: [numberProductionValidator()],
        stock: [numberStockValidator()],
        supplyPrice: [smallValidator(), emptyValidator('供货单价不能为空')]
      }
    }
  },
  methods: {
    load () {
      // 获取接口详情信息
      RecommondApi.recommendDetail(this.id)
        .then((res) => {
          console.log(res.data)
          const { productImageList, sizeImageList, color, size } = res.data
          // 商品图片回显
          // productImageList.forEach((img) => {
          //   img.url = img.imageUrl
          // })
          // // 尺码图片回显
          // sizeImageList.forEach((size) => {
          //   size.url = size.imageUrl
          // })
          // 颜色回显
          this.colors = color.split(',')
          // 尺码回显
          this.sizes = size.split(',')
          // 商品图片回显
          this.imageUrls = productImageList
          // 尺码图片回显
          this.imageSizeUrls = sizeImageList
          res.data.supplyPrice = res.data.supplyPrice.toFixed(2)
          this.ruleForm = res.data
        })
        .catch(() => {

        })
    },
    modify () {
      // 颜色和尺寸
      this.ruleForm.size = this.sizes.join(',')
      this.ruleForm.color = this.colors.join(',')
      // 保存之前处理本地上传的图片的ossPath(商品图片和尺寸图片)
      this.$refs.uploadImages.gotoOss()
      this.$refs.uploadSizeImages.gotoOss()
      this.ruleForm.productImageList = this.imageUrls
      this.ruleForm.sizeImageList = this.imageSizeUrls
      RecommondApi.modifyDetail(this.ruleForm)
        .then(res => {
          // 清除oss的图片
          console.log('eeee')
        })
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
    },
    deleteImages (val) {
      this.delImages.push(val)
      let type = val.ossPath.split('.')[1]
      const deletParams = {
        contentType: `image/${type}`,
        ossPath: val.ossPath,
        productId: ''
      }
      uploadApi.deleteOssUrl(deletParams)
    },
    blur (val) {
      if (val) {
        this.ruleForm.supplyPrice = Number.parseFloat(val).toFixed(2)
        if (parseFloat(val) * 100 > 999999.99 * 100) {
          this.ruleForm.supplyPrice = 999999.99
        }
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
