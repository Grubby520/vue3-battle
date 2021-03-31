<template>
  <!-- 销售属性批量设置 -->
  <el-dialog
    :visible.sync="show"
    :lock-scroll="false"
    width="50%"
    title="销售属性批量设置"
    center
    custom-class="batch-attributes"
    @close="hide"
  >
    <el-form :model="form" ref="form" label-width="12rem" class="odmDetailBase-form-con">
      <!-- sku -->
      <el-form-item label="SKU" prop="skuList">
        <el-checkbox :indeterminate="false" v-model="checkAll" @change="handleCheckAllSku">全选</el-checkbox>
        <div style="margin: 1.5rem 0;"></div>
        <el-checkbox-group v-model="form.skuList" @change="handleCheckSku">
          <el-checkbox
            v-for="(sku, index) in skuList"
            :label="sku.attributeTermId"
            :key="index"
          >{{sku.colorAttributeName}}</el-checkbox>
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
      <hr class="separation" />
      <!-- 带包装重量 -->
      <el-form-item label="带包装重量" prop="sizeList">
        <el-table :data="form.sizeList" border>
          <el-table-column prop="sizeAttributeName" label="尺码" align="center"></el-table-column>
          <el-table-column prop="weight" label="带包装重量（G）" align="center">
            <template v-slot="{row}">
              <el-input
                v-model="row.weight"
                v-slFormatNumber="{ type: 'integer', max: 99999999, compareLength: true, includeZero: true }"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
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
      form: {
        // Sku
        skuList: [],
        // 供货价
        supplyPrice: undefined,
        // 尺寸带包装重量
        sizeList: []
      },
      // 全选所有Sku
      checkAll: false
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
    open (data) {
      this.show = true
      const { sizes, colors } = data
      this.skuList = this.deduplication(colors, 'id')
        .map((sku) => {
          return {
            attributeTermId: sku.id,
            colorAttributeName: sku.name
          }
        })
      this.form.sizeList = this.deduplication(sizes, 'id')
        .map((sku) => {
          return {
            attributeTermId: sku.id,
            sizeAttributeName: sku.name,
            weight: ''
          }
        })
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
