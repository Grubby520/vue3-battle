<template>
  <div>
    <div class="container">
      <div>
        <div class="primary-header">销售属性</div>
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
            <el-table-column prop="supplyPrice" label="供货价格（RMB）" min-width="220px" align="center">
              <template slot="header">
                <p>
                  <span class="star-symble">*</span>供货价格（RMB）
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
                <el-input v-model.trim="row.supplierSkuCode" :disabled="mode === 'view'"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="带包装重量（KG）" min-width="220px" align="center">
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
      <!-- 商品图片 -->
      <div v-if="productImages && productImages.length">
        <div class="secondary-header">
          <span class="secondary-header--title">
            商品图片
            <span
              class="error-tip"
              style="font-weight: normal;margin-left: 20px;"
            >若产品主体超出预览图规范框，则代表该商品不符合规范-仅限产品平铺图，模特图可考虑整体效果。</span>
          </span>
        </div>
        <div class="product-images">
          <template v-for="(item, index) in productImages">
            <div class="product-images--item" :key="index">
              <div class="product-images--name">
                <span class="star-symble">*</span>
                {{item.colorAttributeName}}
              </div>
              <div class="product-images--picture">
                <SlUploadImages
                  v-model="item.images"
                  :imageType="0"
                  :limit="100"
                  :disabled="mode === 'view'"
                >
                  <div slot="content" slot-scope="{file}">
                    <el-button
                      :type="file.isMainImage ? 'primary' : ''"
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
      <el-button type="primary" @click="getSubmitData">获取提交值</el-button>
      <!-- <div v-if="mode === 'view'" class="cover"></div> -->
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
      productSalesAttributeList: [
        // {
        //   id: 0,
        //   productId: 0,
        //   sizeAttributeId: 0,
        //   sizeAttributeName: '',
        //   colorAttributeId: 0,
        //   colorAttributeName: '',
        //   status: 0,
        //   supplierSkuCode: '',
        //   supplyPrice: 0,
        //   weight: 0
        // }
      ],
      productImageList: {
        // additionalProp1: [
        //   {
        //     colorAttributeId: 0,
        //     createTime: '',
        //     hash: '',
        //     id: 0,
        //     imageType: 0,
        //     isMainImage: 0,
        //     productId: 0,
        //     src: '',
        //     status: 0,
        //     updateTime: ''
        //   }
        // ]
      }
    }
  },
  components: {

  },
  mounted () { },
  methods: {
    async initData () {
      let sizeOptions = this.sizeOptions
      let colorOptions = this.colorOptions
      if (!sizeOptions.length || !colorOptions.length) {
        const p1 = this.requestSizeList()
        const p2 = this.requestColorList()
        sizeOptions = await p1
        colorOptions = await p2
      }
      let { productSalesAttributeList = [], productImageList = [] } = this.initialValue
      this.productSalesAttributeList = JSON.parse(JSON.stringify(productSalesAttributeList))
      this.productImageList = JSON.parse(JSON.stringify(productImageList))
      this.productSalesAttributeList.forEach(item => {
        for (let i = 0; i < sizeOptions.length; i++) {
          if (sizeOptions[i].id === +item.sizeAttributeId) {
            item.sizeAttributeName = sizeOptions[i].attrTermName
            this.form.sizes.push({
              attrTermName: sizeOptions[i].attrTermName,
              id: sizeOptions[i].id
            })
            break
          }
        }
        for (let j = 0; j < colorOptions.length; j++) {
          if (colorOptions[j].id === +item.colorAttributeId) {
            item.colorAttributeName = colorOptions[j].attrTermName
            this.form.colors.push({
              attrTermName: colorOptions[j].attrTermName,
              id: colorOptions[j].id
            })
            break
          }
        }
      })
      this.preForm = JSON.parse(JSON.stringify(this.form))
      for (let [key, value] of Object.entries(this.productImageList)) {
        let colorAttributeName = ''
        this.form.colors.map(color => {
          if (color.id === +key) {
            colorAttributeName = color.attrTermName
          }
        })
        value.url = value.src
        this.productImages.push({
          colorAttributeId: key,
          colorAttributeName,
          images: value
        })
      }
    },
    requestSizeList () {
      return new Promise((resolve, reject) => {
        RecommendApi.getAttrList(1, { categoryId: 54 }).then(res => {
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
        RecommendApi.getAttrList(2, { categoryId: this.categoryId }).then(res => {
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
        if (this.productSalesAttributeList[i][attribute + 'AttributeId'] === val) {
          this.productSalesAttributeList.splice(i, 1)
          i--
        }
      }
      if (attribute === 'color') {
        for (let j = 0; j < this.productImages.length; j++) {
          if (this.productImages[j].colorAttributeId === val) {
            this.productImages.splice(j, 1)
            j--
          }
        }
      }
      let index = this[attribute + 'Keys'].findIndex(item => item === val)
      this[attribute + 'Keys'].splice(index, 1)
    },
    validateAll () {
      this.validateAndGet().then(res => { }).catch(() => { })
    },
    validateFormItem () {
      const p = this.validateForm()
      p.then(res => { }).catch(() => { })
    },
    validateAndGet () {
      return new Promise((resolve, reject) => {
        const formPromise = this.validateForm()
        const tablePromise = this.validateTableData()
        const imagePromise = this.validateProductImgs()
        Promise.all([formPromise, tablePromise, imagePromise]).then(res => {
          resolve(this.getSubmitData())
        }).catch(err => {
          this.$message.error(err.message)
          reject(err)
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
        this.productImages.map(item => {
          if (!item.images.length) {
            reject(new Error(`商品图片：请上传 ${item.colorAttributeName} 属性的图片`))
          }
        })
        resolve()
      })
    },
    getSubmitData () {
      let productImageList = {}
      let productSalesAttributeList = []
      this.productImages.map(item => {
        let val = item.images.map(img => {
          return {
            src: img.src,
            colorAttributeId: item.colorAttributeId,
            hash: img.hash,
            isMainImage: img.isMainImage || 0,
            productId: this.productId
          }
        })
        productImageList['' + item.colorAttributeId] = val
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
  padding: 2rem;
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
