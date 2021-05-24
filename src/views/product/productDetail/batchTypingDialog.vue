<template>
  <el-dialog
    :lock-scroll="false"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    width="30%"
    title="批量录入"
    :before-close="handleClose"
  >
    <el-form :model="form" label-position="left" label-width="110px" v-if="visible">
      <el-form-item>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
      </el-form-item>

      <el-form-item v-for="(_, key) of formItem" :label="curAttrName(key)" :key="key">
        <el-checkbox-group v-model="checkedIds[key]" @change="handleSkuChange">
          <el-checkbox
            v-for="zItem in formItem[key]"
            :label="Number(zItem.attributeTermId)"
            :key="zItem.attributeTermId.id"
          >{{zItem.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="供货价">
        <el-input
          v-model="form.supplyPrice"
          clearable
          v-slFormatNumber="{ type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 }"
        ></el-input>
      </el-form-item>

      <el-form-item label="带包装重量">
        <div class="packaged-weight">
          <el-input
            v-model="form.weight"
            clearable
            v-slFormatNumber="{ type: 'gold', max: 99999999, compareLength: true, decimalPlaces: 2 }"
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="batchInput">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      checkAll: false,
      isIndeterminate: false,
      form: {
        supplyPrice: '',
        weight: ''
      },
      checkedIds: {},
      formItem: {}
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    curFormItem: {
      type: Object,
      default: () => { }
    },
    selectAttrList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 全选sku
    handleCheckAll (val) {
      this.checkedIds = {}
      Object.keys(this.formItem).forEach(id => {
        if (val) {
          this.$set(
            this.checkedIds,
            id,
            this.formItem[id].map(item => item.attributeTermId)
          )
        } else {
          this.$set(this.checkedIds, id, [])
        }
      })
      this.isIndeterminate = false
    },
    // 销售属性勾选
    handleSkuChange () {
      const allLength = Object.values(this.formItem).flat().length
      const curLength = Object.values(this.checkedIds).flat().length
      this.checkAll = allLength === curLength
      this.isIndeterminate = curLength > 0 && curLength < allLength
    },
    batchInput () {
      this.$emit('batchInput', {
        ...this.form,
        checkedIds: this.delEmptyObjItem(this.checkedIds)
      })
      this.handleClose()
    },
    // 关闭弹窗
    handleClose () {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data.call(this).form)
    },
    // 属性名
    curAttrName (id) {
      let el = this.selectAttrList.find(
        item => String(item.attributeId) === String(id)
      )
      return el.name
    },
    // 移除空项目
    delEmptyObjItem (data) {
      const result = {}
      Object.keys(data).forEach(item => {
        if (data[item].length) {
          this.$set(result, item, data[item])
        }
      })

      return result
    }
  },
  watch: {
    visible: {
      handler (val) {
        if (val) {
          this.checkAll = true
          this.formItem = this.delEmptyObjItem(this.curFormItem)
          this.handleCheckAll(true)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 20vh !important;

  .el-input {
    max-width: 300px;
  }

  .el-dialog__body {
    max-height: 50vh;
    overflow: auto;
  }

  .packaged-weight {
    .el-input {
      margin-bottom: 10px;
    }
    .el-row {
      max-width: 300px;
    }
    .el-col {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
