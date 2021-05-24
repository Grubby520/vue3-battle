<template>
  <!-- 销售属性批量设置 -->
  <el-dialog
    :visible.sync="show"
    :lock-scroll="false"
    :close-on-click-modal="false"
    width="30%"
    title="批量录入"
    custom-class="batch-attributes"
    @close="hide"
  >
    <el-form
      :model="form"
      ref="form"
      label-position="left"
      label-width="110px"
      class="odmDetailBase-form-con"
    >
      <el-form-item>
        <el-checkbox :indeterminate="false" v-model="checkAll" @change="handleCheckAllSku">全选</el-checkbox>
      </el-form-item>
      <el-form-item label="颜色" prop="skuList">
        <el-checkbox-group v-model="form.skuList" @change="handleCheckSku">
          <el-checkbox
            v-for="(color, index) in skuList"
            :label="color.attributeTermId"
            :key="index"
          >{{color.colorAttributeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="规格" prop="specifications">
        <el-checkbox-group v-model="form.specifications" @change="handleCheckSku">
          <el-checkbox
            v-for="(specification, index) in specifications"
            :label="specification.attributeTermId"
            :key="index"
          >{{specification.specificationsAttributeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="尺码" prop="sizeList">
        <el-checkbox-group v-model="form.sizeList" @change="handleCheckSku">
          <el-checkbox
            v-for="(size, index) in sizeList"
            :label="size.attributeTermId"
            :key="index"
          >{{size.sizeAttributeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 供货价 -->
      <el-form-item label="供货价" prop="supplyPrice">
        <el-input
          clearable
          v-model="form.supplyPrice"
          v-slFormatNumber="{ type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 }"
        />
      </el-form-item>
      <!-- 供货价 -->
      <el-form-item label="带包装重量" prop="weight">
        <el-input
          clearable
          v-model="form.weight"
          v-slFormatNumber="{ type: 'integer', max: 99999999, compareLength: true, includeZero: true }"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'batchAttributes',
  data () {
    return {
      // 控制弹窗是否展示
      show: false,
      // 是否正在请求基础数据
      isLoading: false,
      // 是否正在提交数据
      isConfirm: false,
      // 是否执行取消
      isCancel: true,
      // 待选的Sku集合
      skuList: [],
      sizeList: [],
      specifications: [],
      form: {
        // Sku
        skuList: [],
        specifications: [],
        sizeList: [],
        // 供货价
        supplyPrice: undefined
      },
      // 全选所有Sku
      checkAll: true,
      saleName: ''
    }
  },
  methods: {
    handleCheckSku (skuList) {
      this.checkAll = skuList.length === this.skuList.length
    },
    handleCheckAllSku (isChecked) {
      this.form.skuList = isChecked ? this.skuList.map((sku) => sku.attributeTermId) : []
    },
    /**
    * 打开弹窗
    * @param {String} dialogType 弹窗类型
    * @param {Object} data 入口传入的数据
    */
    open (data, type) {
      this.show = true
      const { sizes, colors, specifications } = data

      this.saleName = type ? '规格' : '尺码'
      this.skuList = this.deduplication(colors, 'id')
        .map((sku) => {
          return {
            attributeTermId: sku.id,
            colorAttributeName: sku.name
          }
        })
      this.sizeList = this.deduplication(sizes, 'id')
        .map((size) => {
          return {
            attributeTermId: size.id,
            sizeAttributeName: size.name
          }
        })
      this.specifications = this.deduplication(specifications, 'id')
        .map((specification) => {
          return {
            attributeTermId: specification.id,
            specificationsAttributeName: specification.name
          }
        })
      this.form.skuList = this.checkAll ? this.skuList.map((sku) => sku.attributeTermId) : []
      this.form.sizeList = this.checkAll ? this.sizeList.map((size) => size.attributeTermId) : []
      this.form.specifications = this.checkAll ? this.specifications.map((size) => size.attributeTermId) : []
    },
    /**
     * 对象数组去重
    * @param {Object} data 去重数组
    * @param {String} primaryKey 去重的唯一标识
     */
    deduplication (data, primaryKey) {
      return data.reduce((pre, cur) => {
        const locationData = pre.find((item) => item[primaryKey] === cur[primaryKey])
        return locationData ? pre : pre.concat(cur)
      }, [])
    },
    // 提交表单数据
    confirm () {
      // 表单业务操作完毕，关闭弹窗
      this.isCancel = false
      this.show = false
    },
    hide () {
      this.$emit('hide', this.form)
      this.resetData()
    },
    // 重置弹窗数据
    resetData () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>

<style lang="scss" scoped>
.separation {
  border: none;
  height: 1px;
  background-color: #ebeef5;
}
</style>
