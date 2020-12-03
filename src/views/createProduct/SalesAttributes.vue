<template>
  <div>
    <div class="container">
      <div>
        <div class="primary-header">销售属性</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <el-form-item label="尺码" prop="sizes">
            <SlSelect
              ref="sizeSelect"
              v-model="form.sizes"
              :options="sizeOptions"
              label="attrTermName"
              value="id"
              filterable
              multiple
              clearable
              isObj
              placeholder="请选择尺码"
              :disabled="false"
              @change="validateFormItem"
            ></SlSelect>
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
              :disabled="false"
              @change="validateFormItem"
            ></SlSelect>
          </el-form-item>
        </el-form>
        <div class="table-wrap">
          <el-table :data="tableData" border style="width: 100%; margin-bottom: 1rem;">
            <el-table-column prop="sizeLabel" label="尺码" width="160px" align="center"></el-table-column>
            <el-table-column prop="colorLabel" label="颜色" width="160px" align="center"></el-table-column>
            <el-table-column prop="price" label="供货价格（RMB）" min-width="220px" align="center">
              <template slot="header">
                <p>
                  <span class="star-symble">*</span>供货价格（RMB）
                </p>
              </template>
              <template v-slot="{row}">
                <el-input
                  v-model="row.price"
                  v-slFormatNumber="{type: 'gold', max: 999999, compareLength: true, decimalPlaces: 2}"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="skuCode" label="商家SKU编码" min-width="220px" align="center">
              <template slot="header">
                <p>
                  <span class="star-symble">*</span>商家SKU编码
                </p>
              </template>
              <template v-slot="{row}">
                <el-input v-model.trim="row.skuCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="带包装重量（KG）" min-width="220px" align="center">
              <template v-slot="{row}">
                <el-input
                  v-model="row.weight"
                  v-slFormatNumber="{type: 'integer', max: 999999, compareLength: true, includeZero:true}"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div class="error-tip">商品供货价：供货价为采购价，并非前台销售价，需低于平台价格（包括1688，淘宝等）。</div>
        </div>
      </div>

      <div v-if="productImages && productImages.length">
        <div class="secondary-header">
          <span class="secondary-header--title">商品图片</span>
        </div>
        <div class="product-images">
          <template v-for="(item, index) in productImages">
            <div class="product-images--item" :key="index">
              <div class="product-images--name">
                <span class="star-symble">*</span>
                {{item.attrTermName}}
              </div>
              <div class="product-images--picture">
                <SlUploadImages v-model="item.images" :imageType="0">
                  <div slot="content" slot-scope="{file}">
                    <el-button
                      :type="item.images.isMainImg ? 'primary' : ''"
                      @click="setColorMainImg(item, file)"
                    >设为颜色主图</el-button>
                  </div>
                </SlUploadImages>
              </div>
            </div>
          </template>
        </div>
        <div class="error-tip">商品图片注意事项：</div>
        <div class="error-tip">1.商品图片必须为商品整体图，图片比例：1：1(正方形）或者4：3,宽高值最大尺寸4096px-4096px,大小不超过4M；</div>
        <div class="error-tip">2.颜色图片建议从正面、侧面、背面，细节各个维度展示商品。每个SKU至少上传4张图片；</div>
      </div>

      <el-button type="primary" @click="validateAll">校验销售属性</el-button>
      <el-button type="primary" @click="changeCategoryID">改变CategoryId</el-button>
    </div>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'

export default {
  name: 'SalesAttributes',
  props: {
    // categoryId: {
    //   type: [String, Number],
    //   default: ''
    // }
  },
  data () {
    return {
      categoryId: '',
      rules: {
        sizes: [
          { required: true, message: '尺码不能为空', trigger: ['blur', 'change'] }
        ],
        colors: [
          { required: true, message: '颜色不能为空', trigger: ['blur', 'change'] }
        ]
      },
      form: {
        sizes: [],
        colors: []
      },
      // 获取自定义属性,,metaFields由父组件传入，，接口获取
      metaFields: [],
      sizeOptions: [{ attrTermName: 'S', id: '1' }, { attrTermName: 'M', id: '2' }, { attrTermName: 'L', id: '3' }, { attrTermName: 'XL', id: '4' }, { attrTermName: 'XXL', id: '5' }],
      colorOptions: [{ attrTermName: 'red', id: '1' }, { attrTermName: 'black', id: '2' }, { attrTermName: 'white', id: '3' }, { attrTermName: 'yellow', id: '4' }],
      tableData: [],
      productImages: [],
      sizeKeys: [],
      colorKeys: []
    }
  },
  components: {

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
    requestInfo () {
      this.clearContents()
      this.requestSizeList()
      this.requestColorList()
    },
    requestSizeList () {
      RecommendApi.getAttrList(1, { categoryId: this.categoryId }).then(res => {
        if (res.data) {
          this.form.sizes = res.data.filter(item => item.state !== 'OFF')
        }
      })
    },
    requestColorList () {
      RecommendApi.getAttrList(2, { categoryId: this.categoryId }).then(res => {
        if (res.data) {
          this.form.colors = res.data.filter(item => item.state !== 'OFF')
        }
      })
    },
    clearContents () {
      this.form = {
        sizes: [],
        colors: []
      }
      this.tableData = []
      this.productImages = []
      this.sizeKeys = []
      this.colorKeys = []
      this.$refs.sizeSelect.handleClear()
      this.$refs.colorSelect.handleClear()
      this.$refs.form.clearValidate()
    },
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
      } else {
        let keys = this.form[attribute + 's'].map(item => item.id)
        let removeKey = ''
        this[attribute + 'Keys'].map(item => {
          if (!keys.includes(item)) {
            removeKey = item
          }
        })
        this.removeAttrTag(removeKey, attribute)
      }
    },
    handleAddTable (attribute, addItem) {
      this.form[attribute === 'size' ? 'colors' : 'sizes'].map(item => {
        let row = {
          key: attribute === 'size' ? '' + addItem.id + item.id : '' + item.id + addItem.id,
          sizeLabel: attribute === 'size' ? addItem.attrTermName : item.attrTermName,
          sizeId: attribute === 'size' ? addItem.id : item.id,
          colorLabel: attribute === 'size' ? item.attrTermName : addItem.attrTermName,
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
      let index = this[attribute + 'Keys'].findIndex(item => item === val)
      this[attribute + 'Keys'].splice(index, 1)
    },
    handleAddProImg (addItem) {
      this.productImages.push({
        colorId: addItem.id,
        attrTermName: addItem.attrTermName,
        images: []
      })
    },
    validateAll () {
      this.validateAndGet().then(res => { }).catch(err => console.log(err))
    },
    validateAndGet () {
      return new Promise((resolve, reject) => {
        const formPromise = this.validateForm()
        const tablePromise = this.validateTableData()
        const imagePromise = this.validateProductImgs()
        Promise.all([formPromise, tablePromise, imagePromise]).then(res => {
          console.log(this.form, this.tableData, this.productImages)
          resolve(this.getAttrData())
        }).catch(err => {
          this.$message.error(err.message)
          reject(err)
        })
      })
    },
    validateFormItem () {
      const p = this.validateForm()
      p.then(res => { }).catch(err => console.log(err.message))
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('销售属性：请先选择尺码和颜色'))
          }
        })
      })
    },
    validateTableData () {
      return new Promise((resolve, reject) => {
        this.tableData.map(item => {
          if (!item.price) {
            reject(new Error(`销售属性：表格项 ${item.sizeLabel} / ${item.colorLabel} 供货价格未填写`))
          }
          if (!item.skuCode) {
            reject(new Error(`销售属性：表格项 ${item.sizeLabel} / ${item.colorLabel} 商家SKU编码未填写`))
          }
        })
        resolve()
      })
    },
    validateProductImgs () {
      return new Promise((resolve, reject) => {
        this.productImages.map(item => {
          if (!item.images.length) {
            reject(new Error(`商品图片：请上传 ${item.attrTermName} 属性的图片`))
          }
        })
        resolve()
      })
    },
    getAttrData () {
      let result = {
        attrForm: this.form,
        attrTable: this.tableData,
        attrImages: this.productImages
      }
      return result
    },
    changeCategoryID () {
      this.categoryId = Math.floor(Math.random() * 100) + 1
    },
    setColorMainImg (row, file) {
      row.images.forEach(img => {
        if (img.file.uid === file.uid) {
          img.isMainImg = true
        } else {
          img.isMainImg = false
        }
      })
      console.log(row.images)
    }
  },
  watch: {
    categoryId (val) {
      if (val) {
        this.requestInfo()
      }
    },
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
    margin: 0 0 1rem 12rem;
  }
  .product-images {
    padding: 1rem 0;
    .product-images--item {
      display: flex;
      margin-bottom: 1rem;
      .product-images--name {
        width: 12rem;
        flex: 0 1 auto;
        text-align: right;
        padding-right: 1.2rem;
        box-sizing: border-box;
      }
      .product-images--picture {
        flex: 1;
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
    margin-right: 0.5rem;
  }
}
</style>
