<template>
  <div>
    <div class="container">
      <!-- 商品图片 -->
      <div>
        <div class="primary-header">
          <span class="primary-header--title">
            商品图片
            <span
              class="error-tip"
              style="font-weight: normal;margin-left: 20px;"
            >若产品主体超出预览图规范框，则代表该商品不符合规范-仅限产品平铺图，模特图可考虑整体效果。</span>
          </span>
        </div>
        <div class="content-body">
          <div class="product-images">
            <div class="product-images--item">
              <div class="product-images--name">
                <span class="star-symble">*</span>
              </div>
              <div class="product-images--picture">
                <template v-for="(item, index) in productImages">
                  <SlUploadImages
                    :key="index"
                    v-model="item.images"
                    :imageType="0"
                    :limit="1"
                    :multiple="false"
                    :disabled="mode === 'view'"
                  ></SlUploadImages>
                </template>
                <div class="error-tip">商品图片注意事项：</div>
                <div
                  class="error-tip"
                >1.商品图片必须为商品整体图，图片比例：1：1(正方形）或者4：3,宽高值最大尺寸4096px-4096px,大小不超过4M；</div>
                <div class="error-tip">2.商品图片建议从正面、侧面、背面，细节各个维度展示商品。至少上传4张图片；</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="primary-header">
          <span class="primary-header--title">销售属性</span>
        </div>
        <div class="content-body">
          <!-- 尺码、颜色表单 -->
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
                :disabled="mode === 'view'"
                @change="selectChange($event, 'size')"
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
                :disabled="mode === 'view'"
                @change="selectChange($event, 'color')"
              ></SlSelect>
            </el-form-item>
          </el-form>
          <!-- 尺码、颜色表格 -->
          <div class="table-wrap">
            <el-table
              :data="productSalesAttributeList"
              border
              style="width: 100%; margin-bottom: 1rem;"
            >
              <el-table-column prop="sizeAttributeName" label="尺码" width="160px" align="center"></el-table-column>
              <el-table-column prop="colorAttributeName" label="颜色" width="160px" align="center"></el-table-column>
              <el-table-column
                prop="supplyPrice"
                label="供货价格（RMB）"
                min-width="220px"
                align="center"
              >
                <template slot="header">
                  <p>
                    <span class="star-symble">*</span>供货价格（RMB）
                    <el-button type="text" @click="fillDown('supplyPrice')">向下填充</el-button>
                  </p>
                </template>
                <template v-slot="{row}">
                  <el-input
                    v-model="row.supplyPrice"
                    v-slFormatNumber="{type: 'gold', max: 999999, compareLength: true, decimalPlaces: 2}"
                    :disabled="mode === 'view'"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="supplierSkuCode"
                label="商家SKU编码"
                min-width="220px"
                align="center"
              >
                <template slot="header">
                  <p>
                    <span class="star-symble">*</span>商家SKU编码
                  </p>
                </template>
                <template v-slot="{row}">
                  <el-input
                    v-model.trim="row.supplierSkuCode"
                    :disabled="mode === 'view'"
                    maxlength="50"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="带包装重量（G）" min-width="220px" align="center">
                <template slot="header">
                  <p>
                    带包装重量（G）
                    <el-button type="text" @click="fillDown('weight')">向下填充</el-button>
                  </p>
                </template>
                <template v-slot="{row}">
                  <el-input
                    v-model="row.weight"
                    v-slFormatNumber="{type: 'integer', max: 999999, compareLength: true, includeZero:true}"
                    :disabled="mode === 'view'"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div class="error-tip">商品供货价：供货价为采购价，并非前台销售价，需低于平台价格（包括1688，淘宝等）。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'

export default {
  name: 'SalesAttributes',
  props: {
    categoryId: {
      type: [String, Number],
      default: ''
    },
    productId: {
      type: [String, Number],
      default: ''
    },
    mode: {
      type: String,
      default: 'edit'
    },
    initialValue: {
      type: Object,
      default: function () {
        return {
          productImageList: [],
          productSalesAttributeList: []
        }
      }
    }
  },
  data () {
    return {
      attrType: [],
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
      preForm: {
        sizes: [],
        colors: []
      },
      sizeOptions: [],
      colorOptions: [],
      productImages: [],
      sizeKeys: [],
      colorKeys: [],
      productSalesAttributeList: [],
      productImageList: {}
    }
  },
  components: {

  },
  mounted () { },
  methods: {
    async initData () {
      this.form = {
        sizes: [],
        colors: []
      }
      this.sizeKeys = []
      this.colorKeys = []
      let sizeOptions = this.sizeOptions
      let colorOptions = this.colorOptions
      if (!sizeOptions.length || !colorOptions.length) {
        await this.requestAllByUser()
        const p1 = this.requestSizeList()
        const p2 = this.requestColorList()
        sizeOptions = await p1
        colorOptions = await p2
      }
      let { productSalesAttributeList = [], productImageList = {} } = this.initialValue
      this.productSalesAttributeList = JSON.parse(JSON.stringify(productSalesAttributeList))
      this.productImageList = JSON.parse(JSON.stringify(productImageList))
      this.productSalesAttributeList.forEach(item => {
        for (let i = 0; i < sizeOptions.length; i++) {
          if (sizeOptions[i].id === +item.sizeAttributeId) {
            item.sizeAttributeName = sizeOptions[i].attrTermName
            if (!this.sizeKeys.includes(sizeOptions[i].id)) {
              this.form.sizes.push({
                attrTermName: sizeOptions[i].attrTermName,
                id: sizeOptions[i].id
              })
              this.sizeKeys.push(sizeOptions[i].id)
            }
            break
          }
        }
        for (let j = 0; j < colorOptions.length; j++) {
          if (colorOptions[j].id === +item.colorAttributeId) {
            item.colorAttributeName = colorOptions[j].attrTermName
            if (!this.colorKeys.includes(colorOptions[j].id)) {
              this.form.colors.push({
                attrTermName: colorOptions[j].attrTermName,
                id: colorOptions[j].id
              })
              this.colorKeys.push(colorOptions[j].id)
            }
            break
          }
        }
      })
      this.preForm = JSON.parse(JSON.stringify(this.form))
      // for (let [key, value] of Object.entries(this.productImageList)) {
      //   let colorAttributeName = ''
      //   this.form.colors.map(color => {
      //     if (color.id === +key) {
      //       colorAttributeName = color.attrTermName
      //     }
      //   })
      //   value.url = value.src
      //   this.productImages.push({
      //     colorAttributeId: key,
      //     colorAttributeName,
      //     images: value
      //   })
      // }
      this.productImages = new Array(8)
      for (let i = 0; i < 8; i++) {
        this.$set(this.productImages, i, {
          images: this.productImageList[i] && this.productImageList[i].src ? [this.productImageList[i]] : []
        })
      }
    },
    requestAllByUser () {
      return new Promise((resolve, reject) => {
        let params = {
          type: 'NEW_ATTRIBUTE'
        }
        RecommendApi.allByUser(params).then(res => {
          if (res.data) {
            this.attrType = res.data
            resolve()
          } else {
            reject(new Error('err'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    requestSizeList () {
      return new Promise((resolve, reject) => {
        let typeId = this.attrType[1].id
        RecommendApi.getAttrList(typeId, { categoryId: this.categoryId, type: 'NEW_ATTRIBUTE' }).then(res => {
          if (res.data) {
            this.sizeOptions = res.data.filter(item => item.state !== 'OFF')
            resolve(this.sizeOptions)
          } else {
            reject(new Error('err'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    requestColorList () {
      return new Promise((resolve, reject) => {
        let typeId = this.attrType[0].id
        RecommendApi.getAttrList(typeId, { categoryId: this.categoryId, type: 'NEW_ATTRIBUTE' }).then(res => {
          if (res.data) {
            this.colorOptions = res.data.filter(item => item.state !== 'OFF')
            resolve(this.colorOptions)
          } else {
            reject(new Error('err'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    clearContents () {
      this.form = {
        sizes: [],
        colors: []
      }
      this.preForm = {
        sizes: [],
        colors: []
      }
      this.productSalesAttributeList = []
      this.productImages = []
      this.sizeKeys = []
      this.colorKeys = []
      this.$refs.sizeSelect.handleClear()
      this.$refs.colorSelect.handleClear()
      this.$refs.form.clearValidate()
    },
    selectChange (e, attribute) {
      this.validateFormItem()
      let len = this.form[attribute + 's'].length || 0
      let oldLen = this.preForm[attribute + 's'].length || 0
      let handle = len - oldLen >= 0 ? 'add' : 'del'
      this.generateTableData(handle, attribute)
      this.preForm = JSON.parse(JSON.stringify(this.form))
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
          productId: this.productId,
          sizeAttributeId: attribute === 'size' ? addItem.id : item.id,
          sizeAttributeName: attribute === 'size' ? addItem.attrTermName : item.attrTermName,
          colorAttributeId: attribute === 'size' ? item.id : addItem.id,
          colorAttributeName: attribute === 'size' ? item.attrTermName : addItem.attrTermName,
          supplierSkuCode: '',
          supplyPrice: '',
          weight: ''
        }
        this.productSalesAttributeList.push(row)
      })
    },
    handleAddProImg (addItem) {
      this.productImages.push({
        colorAttributeId: addItem.id,
        colorAttributeName: addItem.attrTermName,
        images: []
      })
    },
    removeAttrTag (val, attribute) {
      for (let i = 0; i < this.productSalesAttributeList.length; i++) {
        if (+this.productSalesAttributeList[i][attribute + 'AttributeId'] === val) {
          this.productSalesAttributeList.splice(i, 1)
          i--
        }
      }
      let index = this[attribute + 'Keys'].findIndex(item => item === val)
      this[attribute + 'Keys'].splice(index, 1)
    },
    validateAll () {
      this.validateAndGet().then(res => { console.log(res) }).catch(() => { })
    },
    validateFormItem () {
      const p = this.validateForm()
      p.then(res => { }).catch(() => { })
    },
    validateAndGet () {
      return new Promise((resolve, reject) => {
        const formPromise = this.validateForm()
        const imagePromise = this.validateProductImgs()
        const tablePromise = this.validateTableData()
        Promise.all([formPromise, tablePromise, imagePromise]).then(res => {
          resolve(this.getSubmitData())
        }).catch(err => {
          this.$message.error(err.message)
          reject(new Error('saleAttributesInfo'))
        })
      })
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
        this.productSalesAttributeList.map(item => {
          if (!item.supplyPrice) {
            reject(new Error(`销售属性：表格项 ${item.sizeAttributeName} / ${item.colorAttributeName} 供货价格未填写`))
          }
          if (!item.supplierSkuCode) {
            reject(new Error(`销售属性：表格项 ${item.sizeAttributeName} / ${item.colorAttributeName} 商家SKU编码未填写`))
          }
        })
        resolve()
      })
    },
    validateProductImgs () {
      return new Promise((resolve, reject) => {
        let total = 0
        this.productImages.map(item => {
          const LENGTH = item.images.length >>> 0
          if (LENGTH) {
            total++
          }
        })
        if (total < 4) {
          reject(new Error(`商品图片：至少上传4张商品图片`))
        }
        resolve()
      })
    },
    getSubmitData () {
      let productImageList = []
      let productSalesAttributeList = []
      this.productImages.map(item => {
        let val = item.images.map(img => {
          return {
            src: img.src,
            hash: img.hash,
            productId: this.productId,
            id: img.id
          }
        })
        if (val.length) {
          productImageList.push(val[0])
        }
      })
      this.productSalesAttributeList.map(item => {
        let li = JSON.parse(JSON.stringify(item))
        delete li.sizeAttributeName
        delete li.colorAttributeName
        productSalesAttributeList.push(li)
      })
      return {
        productSalesAttributeList,
        productImageList
      }
    },
    setColorMainImg (row, file) {
      row.images.forEach(img => {
        if (img.uid === file.uid) {
          this.$set(img, 'isMainImage', 1)
        } else {
          this.$set(img, 'isMainImage', 0)
        }
      })
    },
    fillDown (col) {
      let len = this.productSalesAttributeList.length >>> 0
      if (len <= 1) return
      let val = this.productSalesAttributeList[0][col]
      this.productSalesAttributeList.forEach(item => {
        item[col] = val
      })
    }
  },
  watch: {
    'initialValue': {
      handler (val) {
        this.initData()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: inherit;
  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
  }
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
        .uploadImage {
          width: 11rem;
          height: 12rem;
          overflow: hidden;
          vertical-align: top;
          display: inline-block;
          margin-right: 2rem;
          /deep/ .el-upload-list--picture-card .el-upload-list__item {
            margin: 0;
          }
        }
      }
    }
  }
  .content-body {
    padding: 2rem;
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
    font-size: 1.8rem;
    padding: 0 20px;
    line-height: 5rem;
    .primary-header--title {
      font-weight: bold;
    }
  }
  .secondary-header {
    font-size: 1.8rem;
    line-height: 4rem;
    margin: 2rem 0;
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
