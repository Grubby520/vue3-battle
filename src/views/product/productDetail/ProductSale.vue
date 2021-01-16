<template>
  <div class="ProductSale">
    <el-card>
      <div slot="header" class="title">
        <span>销售属性</span>
        <el-button @click="checkout">点击校验表单</el-button>
      </div>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" class="ProductSale-from">
          <el-form-item label="尺码" prop="sizes">
            <span class="ProductSale-sizes" @click="openDialog">添加尺码</span>
            <el-tag
              style="margin: 0 0 5px 10px"
              v-for="(tag, index) in form.sizes"
              :key="tag.id"
              closable
              effect="dark"
              :type="['success', 'info', 'danger', 'warning', ''][index%5]"
              @close="removeSizeTag(tag)"
            >{{tag.attrTermName}}</el-tag>
          </el-form-item>
          <el-form-item label="颜色" prop="colors">
            <SlSelect
              ref="colorSelect"
              v-model="form.colors"
              :options="colorOptions"
              label="attrTermName"
              value="id"
              filterable
              multiple
              clearable
              isObj
              placeholder="请选择颜色"
              @change="selectChange($event, 'color')"
            />
          </el-form-item>
          <el-table :data="form.info" style="width:100%;" row-key="key" border>
            <el-table-column
              v-for="item in tableHeadData"
              :key="item.key"
              :width="item.width"
              align="center"
            >
              <template slot="header">
                <span
                  class="ProductSale-from__icon"
                  v-if="['supplyPrice','supplierSkuCode'].includes(item.name)"
                >*</span>
                <span>{{item.label}}</span>
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="`info.${scope.$index}.${item.name}`" :rules="rules[item.name]">
                  <div v-if="item.status==='text'">{{scope.row[item.name].attrTermName}}</div>
                  <el-input v-else v-model="scope.row[item.name]" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <ProductSizeDialog
        ref="ProductSizeDialog"
        :sizeOptions="sizeOptions"
        @confirm="sizeSelectConfirm"
      />
    </el-card>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'
import ProductSizeDialog from './ProductSizeDialog'
import { emptyValidator } from '@shared/validate'
export default {
  components: { ProductSizeDialog },
  data () {
    return {
      form: {
        info: [],
        sizes: [],
        colors: []
      },
      colorOptions: [],
      sizeOptions: [],
      rules: {
        sizes: [emptyValidator('请选择尺寸', 'change')],
        colors: [emptyValidator('请选择颜色', 'change')],
        supplyPrice: [emptyValidator('请输入值', 'blur')],
        supplierSkuCode: [emptyValidator('请输入值', 'blur')]
      },
      tableHeadData: [// 表头字段
        {
          name: 'size',
          label: '尺码',
          status: 'text'
        },
        {
          name: 'color',
          label: '颜色',
          status: 'text'
        },
        {
          name: 'supplyPrice',
          label: '供货价格（RMB）'
        },
        {
          name: 'supplierSkuCode',
          label: '商家SKU编码'
        },
        {
          name: 'tagSize',
          label: '商家吊牌尺码'
        },
        {
          name: 'weight',
          label: '带包装重量（G）'
        }
      ]
    }
  },
  mounted () {
    this.load()
    this.addListItem()
  },
  methods: {
    load () {
      this.getAllSaleAttrs()
    },
    removeSizeTag (tag) {
      this.form.sizes.splice(this.form.sizes.findIndex(size => size.id === tag.id), 1)
      const { sizes, colors } = this.form
      this.addListItem(sizes, colors)
      this.$store.commit('product/SIZEOPTIONS', sizes)
      this.$refs.form.validateField('sizes') // 重新校验表单
    },
    selectChange (e, attribute) {
      this.$refs.form.validateField('colors') // 重新校验表单
      const { sizes, colors } = this.form
      this.addListItem(sizes, colors)
    },
    getAllSaleAttrs () {
      let params = {
        type: 'NEW_ATTRIBUTE'
      }
      RecommendApi.allByUser(params).then(res => {
        if (res.data) {
          this.getSaleAttr(res.data)
        }
      })
    },
    getSaleAttr (attrType) {
      // 获取颜色和尺寸数据
      const types = {}
      types['color'] = attrType[0].id
      types['size'] = attrType[1].id
      for (const type in types) {
        RecommendApi.getAttrList(types[type], { categoryId: this.categoryId, type: 'NEW_ATTRIBUTE' })
          .then(res => {
            if (res.data) {
              const attr = res.data.filter(item => item.state !== 'OFF')
              switch (type) {
                case 'color':
                  this.colorOptions = attr
                  break
                case 'size':
                  this.sizeOptions = attr
                  break
              }
            }
          })
      }
    },
    openDialog () {
      let dialog = this.$refs.ProductSizeDialog
      dialog.open()
      dialog = null
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      this.$refs.form.validateField('sizes') // 重新校验表单
      this.$store.commit('product/SIZEOPTIONS', val)
      this.addListItem(val, this.form.colors)
    },
    addListItem (sizes, colors) {
      // 增加行
      const condition = (sizes && sizes.length > 0) || (colors && colors)
      if (condition) {
        const arr = []
        colors.forEach(color => {
          sizes.forEach(size => {
            const addItem = { size: size, 'color': color, 'key': Date.now(), isEdit: true }
            arr.push(addItem)
          })
        })
        this.form.info = arr
      }
    },
    checkout () {
      this.$refs.form.validate(valid => {
      })
    },
    validateSizes () {

    }
  }
}
</script>

<style scoped lang="scss">
.ProductSale {
  margin-bottom: 2rem;
  &-from {
    padding: 0 12rem;
    &__icon {
      display: inline-block;
      margin-right: 0.5rem;
      color: red;
    }
  }
  &-sizes {
    color: #409eff;
    cursor: default;
  }
  .el-card {
    overflow: unset !important;
  }
  /deep/.el-form-item__content {
    display: inline-block;
  }
  /deep/.stl-big-data-select {
    width: 700px;
  }
  /deep/.el-form-item--small .el-form-item__error {
    width: 300px;
    text-align: left;
  }
}
</style>
