<template>
  <div class="ProductSale">
    <el-card>
      <div slot="header" class="title">
        <span>销售属性</span>
        <el-button @click="checkout">点击校验表单</el-button>
      </div>
      <div class="form">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="120px"
          class="ProductSale-form"
        >
          <el-form-item label="尺码" prop="sizes">
            <span class="ProductSale-sizes" @click="openDialog('size')">添加尺码</span>
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
              :options="colorOptions"
              ref="colorSelect"
              v-model="form.colors"
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
          <div class="ProductSale-table">
            <el-table :data="form.info" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
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
                  <el-form-item
                    :prop="`info.${scope.$index}.${item.name}`"
                    :rules="rules[item.name]"
                    class="ProductSale-from__content"
                  >
                    <div v-if="item.status==='text'">
                      {{
                      item.name ===showAttrName[scope.row.colorId].name ?
                      showAttrName[scope.row.colorId].value :
                      showAttrName[scope.row.sizeId].value
                      }}
                    </div>
                    <el-input
                      v-else
                      v-model="scope.row[item.name]"
                      v-slFormatNumber="['supplyPrice','weight'].includes(item.name) ?numberRule[item.name] :''"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="ProductSale-from__batch">
              <SlSpace />
              <el-button type="primary" @click="openDialog('batchAttributes')">批量录入</el-button>
            </el-row>
          </div>
        </el-form>
      </div>
      <!-- 尺码弹框 -->
      <ProductSizeDialog
        ref="ProductSizeDialog"
        :sizeOptions="sizeOptions"
        @confirm="sizeSelectConfirm"
      />
      <!-- 批量设置弹窗 -->
      <BatchAttributes @hide="hideDialog" ref="batchAttributes" />
    </el-card>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'
import ProductSizeDialog from './ProductSizeDialog'
import BatchAttributes from './batchAttributes'
import { emptyValidator } from '@shared/validate'
export default {
  components: { ProductSizeDialog, BatchAttributes },
  data () {
    return {
      form: {
        info: [],
        sizes: [],
        colors: []
      },
      colorOptions: [],
      sizeOptions: [],
      showAttrName: [],
      rules: {
        sizes: [emptyValidator('请选择尺寸', 'change')],
        colors: [emptyValidator('请选择颜色', 'change')],
        supplyPrice: [emptyValidator('请输入供货价格')],
        supplierSkuCode: [emptyValidator('请输入商家SKU编码')]
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
      ],
      numberRule: {
        'supplyPrice': { type: 'gold', max: 999999, compareLength: true, decimalPlaces: 2 },
        'weight': { type: 'integer', max: 999999, compareLength: true, includeZero: true }
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
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
    selectChange (e, attribute) {
      this.$refs.form.validateField('colors') // 重新校验表单
      const { sizes, colors } = this.form
      this.addListItem(sizes, colors)
    },
    openDialog (type, data = '') {
      let dialog = null
      switch (type) {
        case 'batchAttributes':
          dialog = this.$refs.batchAttributes
          // data = this.productSalesAttributeList
          break
        case 'size':
          dialog = this.$refs.ProductSizeDialog
      }
      dialog.open(type, data)
      dialog = null
    },
    removeSizeTag (tag) {
      this.form.sizes.splice(this.form.sizes.findIndex(size => size.id === tag.id), 1)
      const { sizes, colors } = this.form
      this.addListItem(sizes, colors)
      this.$store.commit('product/SIZEOPTIONS', sizes)
      this.$refs.form.validateField('sizes') // 重新校验表单
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      this.addListItem(val, this.form.colors)
      this.$store.commit('product/SIZEOPTIONS', val)
      this.$refs.form.validateField('sizes') // 重新校验表单
    },
    addListItem (sizes, colors) {
      // 增加行
      const condition = (sizes && sizes.length > 0) || (colors && colors)
      const show = {}
      const attr = []
      if (condition) {
        colors.forEach(color => {
          sizes.forEach(size => {
            show[size.id] = { value: size.attrTermName, name: 'size' }
            show[color.id] = { value: color.attrTermName, name: 'color' }
            const addItem = {
              attributesId: '1111',
              'sizeId': size.id,
              'colorId': color.id,
              supplyPrice: '',
              supplierSkuCode: '',
              tagSize: '',
              weight: ''
            }
            attr.push(addItem)
          })
        })
        // 需要展示的列表尺寸和颜色name
        this.showAttrName = show
        // 保存需要的数据结构
        this.form.info = attr
      }
    },
    hideDialog () {

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
    &__icon {
      display: inline-block;
      margin-right: 0.5rem;
      color: red;
    }
    &__content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__batch {
      display: flex;
      margin-top: 1rem;
    }
  }
  &-table {
    padding: 0 0 0 12rem;
    /deep/.el-form-item__content {
      margin-left: 0 !important;
    }
  }
  &-sizes {
    color: #409eff;
    cursor: default;
  }
  .el-card {
    overflow: unset !important;
  }
}
</style>
