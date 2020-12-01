<template>
  <div>
    <div class="container">
      <div class="primary-header">销售属性</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="尺码" prop="sizes">
          <SlSelect
            v-model="form.sizes"
            :options="sizeOptions"
            label="label"
            value="id"
            filterable
            multiple
            clearable
            isObj
            placeholder="请选择尺码"
            :disabled="false"
            @removeTag="removeAttrTag($event, 'size')"
          ></SlSelect>
        </el-form-item>
        <el-form-item label="颜色" prop="colors">
          <SlSelect
            v-model="form.colors"
            :options="colorOptions"
            label="label"
            value="id"
            filterable
            multiple
            clearable
            isObj
            placeholder="请选择颜色"
            :disabled="false"
            @removeTag="removeAttrTag($event, 'color')"
          ></SlSelect>
        </el-form-item>
      </el-form>
      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%; margin-bottom: 1rem;">
          <el-table-column prop="sizeLabel" label="尺码" width="160px" align="center"></el-table-column>
          <el-table-column prop="colorLabel" label="颜色" width="160px" align="center"></el-table-column>
          <el-table-column prop="price" label="供货价格（RMB）" min-width="220px" align="center">
            <template v-slot="{row}">
              <el-input v-model="row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="skuCode" label="商家SKU编码" min-width="220px" align="center">
            <template v-slot="{row}">
              <el-input v-model="row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="带包装重量（KG）" min-width="220px" align="center">
            <template v-slot="{row}">
              <el-input v-model="row.weight"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="error-tip">商品供货价：供货价为采购价，并非前台销售价，需低于平台价格（包括1688，淘宝等）。</div>
      </div>
      <div class="secondary-header">
        <span class="secondary-header--title">商品图片</span>
      </div>
      <div class="product-images">
        <template v-for="(item, index) in productImages">
          <div class="product-images--item" :key="index">
            <div class="product-images--name">
              <span class="star-symble">*</span>
              {{item.colorLabel}}：
            </div>
            <div class="product-images--picture">
              <SlUploadImages v-model="item.images"></SlUploadImages>
            </div>
          </div>
        </template>
      </div>
      <div class="error-tip">商品图片注意事项：</div>
      <div class="error-tip">1.商品图片必须为商品整体图，图片比例：1：1(正方形）或者4：3,宽高值最大尺寸4096px-4096px,大小不超过4M；</div>
      <div class="error-tip">2.颜色图片建议从正面、侧面、背面，细节各个维度展示商品。每个SKU至少上传4张图片；</div>
    </div>
    <ProductAttributes
      ref="customAttributesInfo"
      :inData="metaFields"
      :canUpdate="true"
      :canView="true"
    ></ProductAttributes>
  </div>
</template>

<script>
import ProductAttributes from '@/views/createProduct/ProductAttributes'
export default {
  name: 'SalesAttributes',
  data () {
    return {
      rules: {},
      form: {
        sizes: [],
        colors: []
      },
      metaFields: [],
      sizeOptions: [{ label: 'S', id: '1' }, { label: 'M', id: '2' }, { label: 'L', id: '3' }, { label: 'XL', id: '4' }, { label: 'XXL', id: '5' }],
      colorOptions: [{ label: 'red', id: '1' }, { label: 'black', id: '2' }, { label: 'white', id: '3' }, { label: 'yellow', id: '4' }],
      tableData: [],
      productImages: [],
      sizeKeys: [],
      colorKeys: []
    }
  },
  components: {
    ProductAttributes
  },
  mounted () {
    this.metaFields = [
      {
        categoryId: 2,
        dataLength: 200,
        dataType: 1,
        defaultValue: 'aa',
        isList: false,
        isRequired: false,
        metadataId: 164,
        multipleSelect: false,
        name: '测试单值',
        optionalDatas: [],
        relationIds: [],
        values: []
      },
      {
        categoryId: 216,
        dataLength: 200,
        dataType: 1,
        defaultValue: '',
        isList: true,
        isRequired: true,
        metadataId: 154,
        multipleSelect: false,
        name: '测试1',
        optionalDatas: [{ id: 307, valueCn: '66' }],
        relationIds: [],
        values: []
      },
      {
        categoryId: 2,
        dataLength: 200,
        dataType: 0,
        defaultValue: '',
        isList: true,
        isRequired: true,
        metadataId: 96,
        multipleSelect: false,
        name: '测试0428',
        optionalDatas: [{ id: 184, valueCn: '12' }],
        relationIds: [],
        values: []
      },
      {
        categoryId: 2,
        dataLength: 200,
        dataType: 1,
        defaultValue: '',
        isList: true,
        isRequired: true,
        metadataId: 37,
        multipleSelect: false,
        name: '形状',
        optionalDatas: [{ id: 78, valueCn: '圆形' }, { id: 79, valueCn: '方形' }],
        relationIds: [],
        values: []
      },
      {
        categoryId: 2,
        dataLength: 200,
        dataType: 1,
        defaultValue: '',
        isList: true,
        isRequired: true,
        metadataId: 36,
        multipleSelect: false,
        name: '尺寸',
        optionalDatas: [{ id: 76, valueCn: '大' }, { id: 77, valueCn: '小' }],
        relationIds: [],
        values: []
      },
      {
        categoryId: 2,
        dataLength: 200,
        dataType: 1,
        defaultValue: '白色',
        isList: true,
        isRequired: true,
        metadataId: 35,
        multipleSelect: false,
        name: '颜色',
        optionalDatas: [{ id: 75, valueCn: '白色' }, { id: 74, valueCn: '黑色' }],
        relationIds: [],
        values: []
      }
    ]
  },
  methods: {
    generateTableData (handle, attribute) {
      if (handle === 'add') {
        let addItem = {}
        this.form[attribute + 's'].map(item => {
          if (!this[attribute + 'Keys'].includes(item.id)) {
            addItem = item
          }
        })
        if (JSON.stringify(addItem) === '{}') return
        this[attribute + 'Keys'].push(addItem.id)
        // 下拉框选择时，处理销售属性表格
        this.handleAddTable(attribute, addItem)

        if (attribute === 'color') {
          // 颜色下拉框选择时，处理商品图片
          this.handleAddProImg(addItem)
        }
      }
    },
    handleAddTable (attribute, addItem) {
      this.form[attribute === 'size' ? 'colors' : 'sizes'].map(item => {
        let row = {
          key: attribute === 'size' ? '' + addItem.id + item.id : '' + item.id + addItem.id,
          sizeLabel: attribute === 'size' ? addItem.label : item.label,
          sizeId: attribute === 'size' ? addItem.id : item.id,
          colorLabel: attribute === 'size' ? item.label : addItem.label,
          colorId: attribute === 'size' ? item.id : addItem.id,
          price: '',
          skuCode: '',
          weight: ''
        }
        this.tableData.push(row)
      })
    },
    removeAttrTag (val, attribute) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][attribute + 'Id'] === val) {
          this.tableData.splice(i, 1)
          i--
        }
      }
      if (attribute === 'color') {
        for (let j = 0; j < this.productImages.length; j++) {
          if (this.productImages[j].colorId === val) {
            this.productImages.splice(j, 1)
            j--
          }
        }
      }
      let index = this[attribute + 'Keys'].findIndex(item => item.id === val)
      this[attribute + 'Keys'].splice(index, 1)
    },
    handleAddProImg (addItem) {
      this.productImages.push({
        colorId: addItem.id,
        colorLabel: addItem.label,
        images: []
      })
    }
  },
  watch: {
    'form.sizes': {
      handler (val, oldVal) {
        let len = val.length || 0
        let oldLen = oldVal.length || 0
        let handle = len - oldLen >= 0 ? 'add' : 'del'
        this.generateTableData(handle, 'size')
      }
    },
    'form.colors': {
      handler (val, oldVal) {
        let len = val.length || 0
        let oldLen = oldVal.length || 0
        let handle = len - oldLen >= 0 ? 'add' : 'del'
        this.generateTableData(handle, 'color')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 2rem;
  .table-wrap {
    margin: 0 0 1rem 10rem;
  }
  .product-images {
    padding: 1rem;
    .product-images--item {
      display: flex;
      margin-bottom: 1rem;
      .product-images--name {
        width: 15rem;
        flex: 0 1 auto;
        text-align: right;
      }
      .product-images--picture {
        flex: 1;
        margin-left: 2rem;
      }
    }
  }
  .normal-tip {
    color: #909399;
    line-height: 2rem;
  }
  .error-tip {
    font-size: 1.4rem;
    color: #f56c6c;
    line-height: 2rem;
  }
  .primary-header {
    font-weight: bold;
    font-size: 1.8rem;
    line-height: 4rem;
    margin-bottom: 2rem;
  }
  .secondary-header {
    font-size: 1.4rem;
    line-height: 3rem;
    margin: 1rem 0;
    .secondary-header--title {
      font-weight: bold;
    }
  }
  .star-symble {
    color: #f56c6c;
  }
}
</style>
