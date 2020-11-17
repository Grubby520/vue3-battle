<template>
  <div class="maintain">
    <div class="maintain__base">
      <p class="maintain__base--p">基本信息</p>
      <el-divider />
      <el-form :model="ruleForm" :rules="rules" ref="form" label-width="130px">
        <el-row type="flex" justify="center" class="maintain__form">
          <el-col :span="11">
            <el-form-item prop="type" label="分类">
              <el-select size="mini" v-model="ruleForm.productName" style="width:100%;">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="type" label="商品名称">
              <el-input
                size="mini"
                clearable
                v-model="ruleForm.remarks"
                placeholder="请输入商品名称"
                maxlength="255"
              />
            </el-form-item>
            <el-form-item prop="type" label="商品图片"></el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="type" label="供方货号">
              <el-input size="mini" clearable v-model="ruleForm.remarks" placeholder="请输入供应货号" />
            </el-form-item>
            <el-form-item prop="type" label="预估重量">
              <el-input size="mini" clearable v-model="ruleForm.remarks" placeholder="请输入预估重量" />
            </el-form-item>
            <el-form-item prop="type" label="供货价格">
              <el-input size="mini" clearable v-model="ruleForm.remarks" placeholder="请输入供货单价" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="maintain__other">
          <p class="maintain__other--p">其他信息</p>
          <el-divider />
          <div class="maintain__other--modify">
            <div class="flex-left">
              <p style="margin-right:10px">颜色</p>
              <i class="el-icon-edit" @click="modifyDialog(1)" />
            </div>
            <div class="flex-left spans">
              <p v-for="color in colors" :key="color.label">{{color.label}}</p>
            </div>
            <div class="flex-left">
              <p style="margin-right:10px">尺码</p>
              <i class="el-icon-edit" @click="modifyDialog(2)" />
            </div>
            <div class="flex-left spans">
              <p v-for="size in sizes" :key="size.label">{{size.label}}</p>
            </div>
            <div v-if="dailog"></div>
            <div class="flex-left checkbox">
              <p>是否有现货</p>
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="有" />
                <el-checkbox label="无" />
              </el-checkbox-group>
              <el-form-item prop="type" label="生产周期">
                <el-input
                  size="mini"
                  clearable
                  v-model="ruleForm.remarks"
                  placeholder="请输入商品名称"
                  maxlength="255"
                />
              </el-form-item>
              <el-form-item prop="type" label="库存数量">
                <el-input
                  size="mini"
                  clearable
                  v-model="ruleForm.remarks"
                  placeholder="请输入商品名称"
                  maxlength="255"
                />
              </el-form-item>
              <el-form-item prop="type" label="当前库存可维持">
                <el-input
                  size="mini"
                  clearable
                  v-model="ruleForm.remarks"
                  placeholder="请输入商品名称"
                  maxlength="255"
                />
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
                <el-input
                  size="mini"
                  clearable
                  v-model="ruleForm.remarks"
                  placeholder="请输入商品名称"
                  maxlength="255"
                />
              </el-form-item>
            </div>
            <div class="flex-left">
              <p>尺码表</p>
            </div>
          </div>
          <div></div>
        </div>
      </el-form>
    </div>
    <SlBaseDetails
      ref="control"
      :references="$refs"
      form="form"
      :mode="mode"
      :create="create"
      :gotoList="gotoList"
      :isRight="true"
      size="mini"
      saveText="确定"
      cancelText="取消"
    />
    <div v-if="dailog">
      <el-dialog :visible.sync="dailog" width="50%" :title="title">
        <ModifyPropery></ModifyPropery>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ModifyPropery from './ModifyPropery'
export default {
  components: { ModifyPropery },
  data () {
    return {
      dailog: false,
      title: '',
      mode: 'create',
      ruleForm: {},
      checkList: ['有'],
      colors: [
        { label: '红色' },
        { label: '蓝色' }
      ],
      sizes: [
        { label: '红色' },
        { label: '蓝色' }
      ],
      status: [
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
      this.dailog = true
    }
  }
}
</script>

<style scoped lang="scss">
.maintain {
  padding: 20px;
  $boder: 1px solid #DCDFE6;
  .title {
    font-size: 15px;
    font-weight: bold;
    color: #DCDFE6;
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
    p {
      background-color: #DCDFE6;
      padding: 0px 10px;
      line-height: 20px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  &__base {
    border: $boder;
    &--p {
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
    &--p {
      @extend .title;
    }
    &--modify {
      padding-left: 10px;
    }
  }
  /deep/.el-divider--horizontal {
    margin: 0 0 24px 0;
  }
}
</style>
