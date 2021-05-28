<template>
  <!-- 销售属性批量设置 -->
  <el-dialog
    :visible.sync="visible"
    :lock-scroll="false"
    :close-on-click-modal="false"
    width="30%"
    title="批量录入"
    custom-class="batch-attributes"
  >
    <el-form
      :model="form"
      ref="form"
      label-position="left"
      label-width="110px"
      class="odmDetailBase-form-con"
    >
      <el-form-item>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
      </el-form-item>
      <el-form-item v-for="(_,key) of formItem" :key="key" :label="saleAttrName(key)">
        <el-checkbox-group v-model="checkedIds[key]" @change="handleCheckSku">
          <el-checkbox
            v-for="zItem in formItem[key]"
            :label="zItem.id"
            :key="zItem.id"
          >{{zItem.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="供货价" prop="supplyPrice">
        <el-input
          clearable
          v-model="form.supplyPrice"
          v-slFormatNumber="{ type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 }"
        />
      </el-form-item>
      <el-form-item label="带包装重量" prop="weight">
        <el-input
          clearable
          v-model="form.weight"
          v-slFormatNumber="{ type: 'integer', max: 99999999, compareLength: true, includeZero: true }"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetData">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isEmpty } from '@shared/util'
export default {
  name: 'batchAttributes',
  data () {
    return {
      visible: false,
      checkAll: false,
      formItem: {},
      checkedIds: {},
      form: {
        supplyPrice: '',
        weight: ''
      },
      isIndeterminate: false
    }
  },
  watch: {
    visible: {
      handler (val) {
        if (val) {
          this.checkAll = true
          this.handleCheckAll(true)
        }
      }
    }
  },
  methods: {
    open (data) {
      this.visible = true
      const { sizes, colors, specifications } = data
      this.formItem = this.formItemAttrs({ sizes, colors, specifications })
    },
    handleCheckSku () {
      const allLength = Object.values(this.formItem).flat().length
      const curLength = Object.values(this.checkedIds).flat().length
      this.checkAll = allLength === curLength
      this.isIndeterminate = curLength > 0 && curLength < allLength
    },
    handleCheckAll (val) {
      this.checkedIds = {}
      Object.keys(this.formItem).forEach(id => {
        if (val) {
          this.$set(
            this.checkedIds,
            id,
            this.formItem[id].map(item => item.id)
          )
        } else {
          this.$set(this.checkedIds, id, [])
        }
      })
      this.isIndeterminate = false
    },
    confirm () {
      const { supplyPrice, weight } = this.form
      this.$emit('hide', { checkedIds: this.checkedIds, supplyPrice, weight })
      this.resetData()
    },
    // 重置弹窗数据
    resetData () {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    saleAttrName (key) {
      const saleType = {
        'NZ010': '颜色',
        'NZ011': '尺码',
        'NZ012': '规格'
      }
      const extendCode = this.formItem[key][0].extendCode
      return saleType[extendCode]
    },
    formItemAttrs (saleAttrData) {
      const saleAttrsTerms = {}
      Object.keys(saleAttrData).forEach(sale => {
        const saleAttr = saleAttrData[sale]
        if (!isEmpty(saleAttr)) {
          const attributeId = saleAttr[0].attributeId
          saleAttrsTerms[attributeId] = saleAttr
          this.checkedIds[attributeId] = []
        }
      })
      return saleAttrsTerms
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
