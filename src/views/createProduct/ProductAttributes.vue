<template>
  <!-- 从erp创建产品的‘产品自定义属性’组件拷贝而来 -->
  <div class="container">
    <div class="primary-header">商品属性</div>
    <el-form :model="form" ref="submitForm" label-width="100px">
      <el-row :gutter="8">
        <el-col :span="6" v-for="(item,itemIndex) in form.metadatas" :key="item.metadataId">
          <el-form-item
            :label="item.name"
            :prop="'metadatas.'+itemIndex+'.value'"
            :rules="[{required: item.isRequired,message: `${item.name}是必填项`,trigger: itemType(item) === 'select'?'change':'blur'}]"
          >
            <template slot="label">
              <span :title="item.name">{{item.name}}</span>
            </template>
            <template v-if="canUpdate">
              <el-select
                v-if="itemType(item) === 'select'"
                :multiple="item.multipleSelect"
                filterable
                clearable
                v-model="item.value"
                placeholder="请选择"
              >
                <el-option
                  v-for="(opt, index) in item.optionalDatas"
                  :key="'valueCn-' + index"
                  :label="opt.valueCn"
                  :value="opt.valueCn"
                ></el-option>
                <!-- 处理单选时使用的自定义属性值被删除后UI异常的情况 -->
                <el-option
                  v-if="!item.multipleSelect && item.value !== '' && !item.optionalDatas.find(ele=>ele.valueCn === item.value)"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-radio-group v-else-if="itemType(item) === 'radio'" v-model="item.value">
                <el-radio v-show="!item.isRequired" label>未选择</el-radio>
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
              <el-input
                v-else
                :type="item.dataType == 0 ? 'number' : 'text'"
                v-model="item.value"
                placeholder="请输入内容"
              ></el-input>
            </template>
            <template v-else-if="canView">
              <template v-if="item.multipleSelect && item.isList">
                <el-tag v-for="text in item.value" :key="'multipleSelect_' + text">{{text}}</el-tag>
              </template>
              <template v-else-if="item.dataType == 2">{{item.value == 'false' ? '否' : '是'}}</template>
              <span v-else>{{item.value}}</span>
            </template>
            <span v-else>******</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 暂时屏蔽 勿删 -->
      <!-- <div class="custom-attribute">
                <el-link type="primary" v-if="canUpdateFreestyle" @click="popupTemplateDialog">
                    存为常用模板
                </el-link>
                <div v-if="templateAttrItems.length > 0 && canUpdateFreestyle">
                    <span>我的常用属性：</span>
                    <div>
                        <span class="template-module" v-for="(item, index) in templateAttrItems" :key="`l${index}`">
                            <el-button class="text-overflow" style="max-width:150px" type="primary"
                                @click="applicationTemplate(item)" plain :title="item.name">
                                {{item.name}}</el-button>
                            <el-button type="text" style="margin-left: 7px; " @click="editTemplate(item)">
                                {{$t('button.edit')}}</el-button>
                        </span>
                    </div>
                </div>
      </div>-->
    </el-form>

    <!-- <el-dialog
      :title="templateForm.id ? '编辑我的常用模板' : '保存为常用模板'"
      :lock-scroll="false"
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="templateVisible"
      width="40%"
      custom-class="template-dialog"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        label-width="100px"
        label-suffix=" :"
        label-position="left"
      >
        <el-form-item label="当前分类">{{categoryName}}</el-form-item>
        <el-form-item
          label="模板名称"
          prop="name"
          :rules="[{required: true ,message: '模板名称是必填项',trigger: 'blur'}]"
        >
          <el-input v-model.trim="templateForm.name" maxlength="30" autocomplete="off"></el-input>
        </el-form-item>

        <fieldset class="fieldset">
          <legend>属性组合</legend>

          <el-col
            :span="12"
            v-for="(item,itemIndex) in templateForm.metadatas"
            :key="item.metadataId"
          >
            <el-form-item
              :label="item.name"
              :prop="'metadatas.'+itemIndex+'.value'"
              :rules="[{required: item.isRequired,message: `${item.name}是必填项`,trigger: itemType(item) === 'select'?'change':'blur'}]"
            >
              <template slot="label">
                <span :title="item.name">{{item.name}}</span>
              </template>
              <el-select
                v-if="itemType(item) === 'select'"
                :multiple="item.multipleSelect"
                filterable
                clearable
                v-model="item.value"
                placeholder="请选择"
              >
                <el-option
                  v-for="(opt, index) in item.optionalDatas"
                  :key="'valueCn-' + index"
                  :label="opt.valueCn"
                  :value="opt.valueCn"
                ></el-option>
                处理单选时使用的自定义属性值被删除后UI异常的情况
                <el-option
                  v-if="!item.multipleSelect && item.value !== '' && !item.optionalDatas.find(ele=>ele.valueCn === item.value)"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-radio-group v-else-if="itemType(item) === 'radio'" v-model="item.value">
                <el-radio v-show="!item.isRequired" label>未选择</el-radio>
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
              <el-input
                v-else
                :type="item.dataType == 0 ? 'number' : 'text'"
                v-model="item.value"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="templateForm.id"
          type="danger"
          @click="delAttributeTemp"
        >{{$t('button.delete')}}</el-button>
        <el-button @click="templateVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button
          type="primary"
          @click="saveTemplate('templateForm')"
          :disabled="btnLoading"
        >{{$t('button.save')}}</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
// import Product from '@/api/product'
// import { createNamespacedHelpers } from 'vuex'
// const { mapGetters, mapState } = createNamespacedHelpers('createProduct')
export default {
  name: 'ProductAttributes',
  props: {
    inData: {
      type: Array,
      default: () => {
        // 数组内数据结构
        // {
        //     metadataId: null,
        //     categoryId: null,
        //     name: null,
        //     defaultValue: null,
        //     isList: null, // 是否是列表
        //     isRequired: null, // 是否必填
        //     multipleSelect: null, // 是否支持多选
        //     dataType: null, // 0:数字 1:文本 2:布尔值
        //     dataLength: null,
        //     optionalDatas: [],
        //     values: [],
        //     relationIds: []
        // }
        return []
      }
    },
    // 能否更新
    canUpdate: {
      type: Boolean,
      default: true
    },
    // 能否查看
    canView: {
      type: Boolean,
      default: false
    },
    categoryName: {
      type: String,
      default: ''
    },
    categoryId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      form: {
        metadatas: []
      },
      originalData: null,
      formRules: {},
      templateVisible: false,
      templateForm: {
        name: '',
        id: '',
        metadatas: []
      },
      templateAttrItems: [],
      btnLoading: false
    }
  },
  computed: {
    itemType () {
      return (item) => {
        let type = 'input'
        switch (true) {
          case item.isList:
            type = 'select'
            break
          case item.dataType === 2:
            type = 'radio'
            break
          case item.dataType !== 2 && !item.isList:
            type = 'input'
            break
        }
        return type
      }
    }
  },
  watch: {
    inData: {
      handler: function (val) {
        val = JSON.parse(JSON.stringify(val))
        this.form.metadatas = []
        if (Array.isArray(val) && val.length > 0) {
          val.forEach((item, index) => {
            let temp = this.initItemValue(item)
            this.form.metadatas.push({})
            Object.keys(temp).forEach((key) => {
              this.$set(
                this.form.metadatas[index],
                key,
                temp[key]
              )
            })
          })
        }
        this.originalData = JSON.parse(
          JSON.stringify(this.form.metadatas)
        )
        // this.getAttributeTemp()
      },
      immediate: true
    }
  },
  components: {},
  methods: {
    initItemValue (item) {
      // 多值情况
      if (item.multipleSelect && item.isList) {
        let value = []
        if (item.values && item.values.length > 0) {
          value = JSON.parse(JSON.stringify(item.values))
        } else {
          value = item.defaultValue ? [item.defaultValue] : []
        }
        item['value'] = value
        return item
      }

      // 单值情况
      item['value'] =
        item.values && item.values.length > 0
          ? item.values[0]
          : item.defaultValue
      return item
    },
    // 供产品详情组件使用的数据
    getProductDetailUseData (isValidate = true) {
      let data = []
      let metadatas = JSON.parse(JSON.stringify(this.form.metadatas))
      data = metadatas.map((ele) => {
        ele.values = Array.isArray(ele.value) ? ele.value : [ele.value]
        return {
          metadataId: ele.metadataId,
          name: ele.name,
          values: ele.values,
          optionalDatas: ele.optionalDatas,
          isList: ele.isList
        }
      })

      if (!isValidate) {
        return Promise.resolve(data)
      }
      return new Promise((resolve, reject) => {
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            resolve(data)
          } else {
            resolve(false)
          }
        })
      })
    },
    transferToSubmitData () {
      let data = []
      let metadatas = JSON.parse(JSON.stringify(this.form.metadatas))
      data = metadatas.map((ele) => {
        ele.values = Array.isArray(ele.value) ? ele.value : [ele.value]
        if (ele.isList) {
          ele.relationIds = ele.optionalDatas.reduce((prev, cur) => {
            if (ele.value.includes(cur.valueCn)) {
              prev.push(cur.id)
            }
            return prev
          }, [])
        }
        delete ele['value']

        return {
          metadataId: ele.metadataId,
          relationIds: ele.relationIds,
          valueCns: ele.values
        }
      })
      return data
    },
    hasDataChanged () {
      let originalDataStr = JSON.stringify(this.originalData)
      let upToDateDataStr = JSON.stringify(this.form.metadatas)

      return originalDataStr !== upToDateDataStr
    },
    getSubmitData (isDraft = true) {
      if (isDraft) {
        return Promise.resolve(this.transferToSubmitData())
      }
      return new Promise((resolve, reject) => {
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            resolve(this.transferToSubmitData())
          } else {
            resolve(false)
          }
        })
      })
    },
    resetForm () {
      this.$refs['submitForm'].resetFields()
    }

    // popupTemplateDialog () {
    //   this.templateVisible = true
    //   this.templateForm.name = ''
    //   this.templateForm.id = ''
    //   this.templateForm.metadatas = JSON.parse(
    //     JSON.stringify(this.form.metadatas)
    //   )
    // },

    // 保存自定义属性模板
    // saveTemplate (refName) {
    //   this.$refs[refName].validate((valid) => {
    //     if (valid) {
    //       const params = {
    //         id: this.templateForm.id,
    //         name: this.templateForm.name,
    //         jsonData: JSON.stringify(this.templateForm.metadatas),
    //         type: 'PRODUCT_METAFIELD',
    //         categoryId: this.categoryId
    //       }
    //       let apiMethod = params.id
    //         ? Product.updateAttributeTemp
    //         : Product.saveAttributeTemp
    //       this.btnLoading = true
    //       apiMethod(params)
    //         .then((res) => {
    //           this.notify('保存成功')
    //         })
    //         .catch(() => {
    //           this.btnLoading = false
    //         })
    //     }
    //   })
    // },

    // 编辑自定义属性模板
    // editTemplate (item) {
    //   this.templateForm.id = item.id
    //   this.templateForm.name = item.name
    //   this.templateForm.metadatas = JSON.parse(
    //     JSON.stringify(item.metadatas)
    //   )
    //   this.templateVisible = true
    // },

    // 应用自定义属性模板
    // applicationTemplate (item) {
    //   item.metadatas.forEach((zItem) => {
    //     if (zItem.value) {
    //       let index = this.form.metadatas.findIndex(
    //         (item) => item.name === zItem.name
    //       )

    //       if (index > -1) {
    //         this.form.metadatas[index]['value'] = zItem.value
    //       }
    //     }
    //   })
    // },

    // 获取自定义属性模板
    // getAttributeTemp () {
    //   if (!this.categoryId) {
    //     return
    //   }
    //   const params = {
    //     type: 'PRODUCT_METAFIELD',
    //     categoryId: this.categoryId
    //   }
    //   Product.getAttributeTemp(params).then((res) => {
    //     this.templateAttrItems = res.data.map((item) => ({
    //       metadatas: JSON.parse(item.jsonData),
    //       id: item.id,
    //       name: item.name
    //     }))
    //   })
    // },

    // 删除自定义属性模板
    // delAttributeTemp () {
    //   this.$confirm('你确定要删除当前模板吗？', '提示', {
    //     lockScroll: false
    //   }).then(
    //     () => {
    //       Product.delAttributeTemp(this.templateForm.id).then(
    //         (res) => {
    //           this.notify('删除成功')
    //         }
    //       )
    //     },
    //     () => { }
    //   )
    // },

    // notify (message) {
    //   this.templateVisible = false
    //   this.btnLoading = false
    //   this.$notify({
    //     title: '成功',
    //     message,
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.getAttributeTemp()
    // }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 2rem;
}
.container,
.template-dialog /deep/ {
  .el-form-item__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 解决label过长星号放在后面被遮住的问题
  .el-form-item {
    &.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      content: '*';
      margin-right: 4px;
      color: #f00;
    }

    &.is-required .el-form-item__label:after {
      content: '';
    }
  }
}

.template-dialog /deep/ {
  .el-col-12 {
    padding-left: 0 !important;
  }
  .el-select {
    width: 100%;
  }
}

.custom-attribute {
  display: flex;
  align-items: center;
  padding-bottom: 20px;

  span {
    margin-right: 15px;
  }

  > div {
    display: flex;
    align-items: center;
  }

  .template-module {
    white-space: nowrap;
    display: inline-block;
    .template-span {
      &:hover {
        cursor: pointer;
        color: #f56c6c;
      }
    }
  }
}
.primary-header {
  font-weight: bold;
  font-size: 1.8rem;
  line-height: 4rem;
  margin-bottom: 2rem;
}
</style>
