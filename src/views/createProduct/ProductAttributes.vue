<template>
  <!-- 从erp创建产品的‘产品自定义属性’组件拷贝而来 -->
  <div class="container">
    <div v-if="form.metadatas.length" class="primary-header">商品属性</div>
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
    </el-form>
  </div>
</template>

<script>
import RecommendApi from '@api/recommendProducts/recommendProducts'

export default {
  name: 'ProductAttributes',
  props: {
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
    },
    productId: {
      type: [String, Number],
      default: ''
    },
    initialValue: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      inData: [],
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
      btnLoading: false,
      emptyMetaFields: []
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
      }
    },
    initialValue: {
      handler: function (val) {
        this.initData()
      },
      immediate: true
    }
  },
  components: {},
  methods: {
    async initData () {
      let emptyMetaFields = this.emptyMetaFields
      if (!emptyMetaFields.length) {
        emptyMetaFields = await this.requestMetaFields()
      }
      let metaObj = {}
      this.initialValue.map(item => {
        if (item.customizeAttributeId) {
          metaObj[item.customizeAttributeId] = item
        }
      })
      // inData改变，触发watch监听，之后逻辑与erp端一致
      this.inData = emptyMetaFields.map(item => {
        item.values = metaObj[item.metadataId] ? metaObj[item.metadataId].customizeAttributeValue : []
        item.productId = metaObj[item.metadataId] ? metaObj[item.metadataId].productId : ''
        item.id = metaObj[item.metadataId] ? metaObj[item.metadataId].id : ''
        item.status = metaObj[item.metadataId] ? metaObj[item.metadataId].status : ''
        return item
      })
    },
    requestMetaFields () {
      return new Promise((resolve, reject) => {
        RecommendApi.getMetadata(this.categoryId).then(res => {
          if (res.data) {
            this.resourceData = res.data
            resolve(this.resourceData)
          } else {
            reject(new Error('err'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
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
        // return {
        //   metadataId: ele.metadataId,
        //   relationIds: ele.relationIds,
        //   valueCns: ele.values
        // }
        // srm:提交时的数据
        return {
          categoryId: ele.categoryId,
          customizeAttributeId: ele.metadataId,
          customizeAttributeValue: ele.values,
          id: ele.id,
          productId: ele.productId,
          status: ele.status
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
            this.$message.error('商品属性：请填写必填项')
            resolve(false)
          }
        })
      })
    },
    resetForm () {
      this.$refs['submitForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.container,
.template-dialog {
  padding: 2rem;
  /deep/ .el-form {
    .el-form-item__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // 解决label过长星号放在后面被遮住的问题
    .el-form-item {
      min-height: 4rem;
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
