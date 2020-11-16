<template>
  <div class="maintain">
    <div class="maintain-base">
      <p>基本信息</p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="maintain-base-form"
      >
        <el-row type="flex" justify="center">
          <el-col :span="11">
            <el-form-item prop="type" label="分类">
              <el-select size="mini" v-model="ruleForm.productName" style="width:100%;">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
      </el-form>
    </div>
    <div class="maintain-other">
      <p>其他信息</p>
      <div class="maintain-other-modify">
        <div class="flex-left">
          <p style="margin-right:10px">颜色</p>
          <i class="el-icon-edit" />
        </div>
        <div></div>
        <div class="flex-left">
          <p style="margin-right:10px">尺码</p>
          <i class="el-icon-edit" />
        </div>
        <div></div>
        <p>是否有现货</p>
        <p>是否有版</p>
        <p>尺码表</p>
      </div>
      <div></div>
    </div>
    <SlBaseDetails
      ref="control"
      :references="$refs"
      form="form"
      :mode="mode"
      :create="create"
      :gotoList="gotoList"
      size="mini"
      saveText="确定"
      cancelText="取消"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {},
      status: [
        { 'value': 1, 'label': '男装' },
        { 'value': 2, 'label': '女装' },
        { 'value': 3, 'label': '童装' },
        { 'value': 4, 'label': '内衣' },
        { 'value': 5, 'label': '手袋' },
        { 'value': 6, 'label': '服饰配件' },
        { 'value': 7, 'label': '男鞋' },
        { 'value': 8, 'label': '女鞋' }

      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.maintain {
  padding: 20px;
  @mixin boder {
    border: 1px solid #DCDFE6;
    p:first-child {
      font-size: 15px;
      font-weight: bold;
      color: #DCDFE6;
      margin: 10px 0 10px 10px;
    }
  }
  &-base {
    @include boder;
    border-bottom: none;
    &-form {
      border-top: 1px solid #DCDFE6;
    }
  }
  &-other {
    @include boder;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    &-modify {
      border-top: 1px solid #DCDFE6;
      p {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
  }
}
</style>
