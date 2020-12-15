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
                <SlUploadImages
                  v-model="productImages"
                  :imageType="0"
                  :limit="8"
                  :multiple="true"
                  :disabled="mode === 'view'"
                ></SlUploadImages>
                <template v-for="(item, index) in [1,2,3,4,5,6,7]">
                  <div v-if="index >= productImages.length" :key="index" class="dashed-box">
                    <i class="el-icon-plus"></i>
                  </div>
                </template>
                <div class="error-tip">商品图片注意事项：</div>
                <div
                  class="error-tip"
                >1.商品图片必须为商品整体图，图片比例：1：1(正方形）或者4：3,宽高值最大尺寸4096px-4096px,大小不超过4M；</div>
                <div class="error-tip">2.商品图片建议从正面、侧面、背面，细节各个维度展示商品。至少上传4张图片；</div>
              </div>
            </div>
          </div>
          <!-- <el-button type="primary" @click="validateAll">校验</el-button> -->
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
              <el-button type="text" @click="handleAddSize">添加尺码</el-button>
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
              <!-- <el-table-column prop="tagSize" label="商家吊牌尺码" min-width="220px" align="center">
                <template v-slot="{row}">
                  <el-input v-model="row.tagSize" :disabled="mode === 'view'"></el-input>
                </template>
              </el-table-column>-->
              <el-table-column prop="weight" label="带包装重量（G）" min-width="220px" align="center">
                <template slot="header">
                  <p>带包装重量（G）</p>
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

    <SizeSelectDialog
      :visible.sync="sizeSelectDialogVisible"
      :formSizes="form.sizes"
      :categoryId="categoryId"
      :sizeOptions="sizeOptions"
      @confirm="sizeSelectConfirm"
    ></SizeSelectDialog>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'
import SizeSelectDialog from '@/views/createProduct/SizeSelectDialog'

export default {
  name: 'SalesAttributes',
  components: {
    SizeSelectDialog
  },
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
      productImageList: {},
      sizeSelectDialogVisible: false
    }
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
      let { productSalesAttributeList = [], productImageList = [] } = this.initialValue
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
      this.productImages = JSON.parse(JSON.stringify(productImageList))
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
          // tagSize: ''
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
    // validateAll () {
    //   this.validateAndGet().then(res => { console.log(res) }).catch(() => { })
    // },
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
        const LENGTH = this.productImages.length >>> 0
        if (LENGTH < 4) {
          reject(new Error(`商品图片：至少上传4张商品图片`))
        }
        resolve()
      })
    },
    getSubmitData () {
      let productImageList = []
      let productSalesAttributeList = []
      this.productSalesAttributeList.map(item => {
        let li = JSON.parse(JSON.stringify(item))
        delete li.sizeAttributeName
        delete li.colorAttributeName
        productSalesAttributeList.push(li)
      })
      productImageList = this.productImages.map(item => {
        return {
          src: item.src,
          hash: item.hash,
          productId: this.productId,
          id: item.id
        }
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
    handleAddSize () {
      this.sizeSelectDialogVisible = true
    },
    removeSizeTag (tag) {
      this.form.sizes.splice(this.form.sizes.findIndex(size => size.id === tag.id), 1)
      this.generateTableData('del', 'size')
      this.preForm = JSON.parse(JSON.stringify(this.form))
    },
    sizeSelectConfirm (val) {
      this.form.sizes = val
      let table = []
      this.form.sizes.map(size => {
        this.form.colors.map(color => {
          table.push({
            productId: this.productId,
            sizeAttributeId: size.id,
            sizeAttributeName: size.attrTermName,
            colorAttributeId: color.id,
            colorAttributeName: color.attrTermName,
            supplierSkuCode: '',
            supplyPrice: '',
            weight: ''
            // tagSize: ''
          })
        })
      })
      this.productSalesAttributeList.map(current => {
        table.forEach(next => {
          if (current.sizeAttributeId === next.sizeAttributeId && current.colorAttributeId === next.colorAttributeId) {
            next.supplierSkuCode = current.supplierSkuCode
            next.supplyPrice = current.supplyPrice
            next.weight = current.weight
            next.tagSize = current.tagSize
          }
        })
      })
      this.productSalesAttributeList = JSON.parse(JSON.stringify(table))
      this.sizeKeys = this.form.sizes.map(size => size.id)
      this.preForm = JSON.parse(JSON.stringify(this.form))
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
        .uploadImage {
          display: inline-block;
          /deep/ .el-upload--picture-card {
            border-color: #409eff;
            &:hover {
              border-color: #2190ff;
            }
            .el-icon-plus {
              color: #409eff;
            }
          }
        }
        .dashed-box {
          display: inline-block;
          text-align: center;
          line-height: 11rem;
          width: 11rem;
          height: 11rem;
          border: 1px dashed #e0e0e0;
          border-radius: 5px;
          margin: 0 0 2rem 1rem;
          vertical-align: top;
          i {
            font-size: 2rem;
            color: #e0e0e0;
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
