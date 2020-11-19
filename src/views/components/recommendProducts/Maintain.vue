<template>
  <div class="maintain">
    <div class="maintain__base">
      <p class="maintain__base-baseTitle">基本信息</p>
      <el-divider />
      <el-form :model="ruleForm" :rules="rules" ref="form" label-width="130px">
        <el-row type="flex" justify="center" class="maintain__form">
          <el-col :span="11">
            <el-form-item prop="type" label="分类">
              <el-select v-model="ruleForm.productName" style="width:100%;">
                <el-option
                  v-for="item in category"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="type" label="商品名称">
              <el-input clearable v-model="ruleForm.remarks" placeholder="请输入商品名称" maxlength="255" />
            </el-form-item>
            <el-form-item prop="type" label="商品图片">
              <SlUploadImages></SlUploadImages>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="type" label="供方货号">
              <el-input clearable v-model="ruleForm.remarks" placeholder="请输入供应货号" />
            </el-form-item>
            <el-form-item prop="type" label="预估重量">
              <el-input clearable v-model="ruleForm.remarks" placeholder="请输入预估重量" />
            </el-form-item>
            <el-form-item prop="type" label="供货价格">
              <el-input clearable v-model="ruleForm.remarks" placeholder="请输入供货单价" />
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
            <div v-if="dialog"></div>
            <div class="flex-left checkbox">
              <p>是否有现货</p>
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="有" />
                <el-checkbox label="无" />
              </el-checkbox-group>
              <el-form-item prop="type" label="生产周期">
                <el-input-number
                  v-model="ruleForm.num"
                  controls-position="right"
                  @change="handleChange"
                  :min="1"
                />
              </el-form-item>
              <el-form-item prop="type" label="库存数量">
                <el-input clearable v-model="ruleForm.remarks" maxlength="255" />
              </el-form-item>
              <el-form-item prop="type" label="当前库存可维持">
                <el-input clearable v-model="ruleForm.remarks" maxlength="255" />
              </el-form-item>
              <p>{{'天'}}</p>
            </div>
            <div class="flex-left checkbox">
              <p>是否有版</p>
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="有" />
                <el-checkbox label="无" />
              </el-checkbox-group>
              <el-form-item prop="type" label="打版周期">
                <el-input-number
                  v-model="ruleForm.num1"
                  controls-position="right"
                  @change="handleChange"
                  :min="1"
                  maxlength="255"
                />
              </el-form-item>
            </div>
            <div class="flex-left checkbox">
              <p>尺码表</p>
              <SlUploadImages></SlUploadImages>
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
        :create="create"
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
      ruleForm: {
        num: 1,
        num1: 1
      },
      checkList: ['有'],
      colors: [],
      sizes: [],
      category: [
        { 'value': 1, 'label': '男装' },
        { 'value': 2, 'label': '女装' },
        { 'value': 3, 'label': '童装' },
        { 'value': 4, 'label': '内衣' },
        { 'value': 5, 'label': '手袋' },
        { 'value': 6, 'label': '服饰配件' },
        { 'value': 7, 'label': '男鞋' },
        { 'value': 8, 'label': '女鞋' }
      ],
      rules: {}
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    create () { },
    gotoList () {
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
      console.log(val, 'properys', properys)
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
    color: #dcdfe6;
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
    }
    p:last-child {
      margin-left: 10px;
    }
  }
  .spans {
    border: $boder;
    padding: 2px;
    height: 20px;
    p {
      background-color: #96999e;
      padding: 0px 10px;
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
