<template>
  <div class="ProductAttr">
    <el-card>
      <div slot="header" class="title">
        <span>商品属性</span>
      </div>
      <p v-if="form.attributesData.length===0" class="align-center no-data">~暂无数据~</p>
      <div class="form" v-else>
        <el-form :model="form" ref="form" label-width="20rem">
          <el-row :gutter="8">
            <el-col
              :span="12"
              v-for="(attribute, index) in form.attributesData"
              :key="attribute.attributeId"
            >
              <el-form-item
                :label="attribute.name"
                :prop="'attributesData.'+index+'.value'"
                :rules="[{required: attribute.required, message: `${attribute.name}是必填项`, trigger: attribute.termValueType === 1 ? 'change' : 'blur'}]"
              >
                <template slot="label">
                  <el-tooltip effect="dark" :content="attribute.name" placement="top">
                    <span class="form-label pointer-enable">{{attribute.name}}</span>
                  </el-tooltip>
                </template>
                <component
                  v-model="attribute.value"
                  :is="itemType(attribute)"
                  :multiple="attribute.checkbox"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(term, index) in attribute.terms"
                    :key="index"
                    :label="term.name"
                    :value="term.id"
                    :disabled="term.deleted"
                  ></el-option>
                </component>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { deepClone } from '@shared/util'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      form: {
        attributesData: []
      },
      dataMap: new Map()
    }
  },
  created () {

  },
  mounted () {
  },
  computed: {
    ...mapGetters('product', ['customAttributesData', 'productCustomAttributes']),
    customAttributes () {
      const { customAttributesData, productCustomAttributes } = this
      return { customAttributesData, productCustomAttributes }
    }
  },
  watch: {
    customAttributes: {
      handler (data) {
        const attributes = this.parseCustomerAttributes(data)
        this.form.attributesData = attributes.filter((attribute) => attribute.usable) // 属性是可用的
          .sort((prev, next) => prev.priority - next.priority) // 根据优先级进行排序
          .map((attribute) => {
            const attributeData = this.dataMap.get(`${attribute.id}`) || {}
            // termValueType [1: 标准化文本] [2: 自定义文本]
            const attributeValues = (attributeData.attribute || {}).termValueType === 1
              ? (attributeData.attributeTerms || []).map(term => term.id) : attributeData.attributeValue
            let value = attributeValues || []
            // 如果值存在 且是数组 且不是多选
            if (value && Array.isArray(value) && !attribute.checkbox) {
              value = value.length > 0 ? value[0] : undefined
            }
            return {
              id: attributeData.id || null,
              attributeId: attribute.id,
              name: attribute.name,
              termValueType: attribute.termValueType,
              checkbox: attribute.checkbox,
              required: attribute.required,
              terms: attribute.terms,
              value: value
            }
          })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    itemType (item) {
      return item.termValueType === 1 ? 'el-select' : 'el-input'
    },
    /**
     * 构造界面需要展示的自定义属性集合
     */
    parseCustomerAttributes (data) {
      // 分类下的属性列表
      const attributesList = data.customAttributesData
      // 推品下的属性数据列表
      const attributesData = data.productCustomAttributes

      this.stashAttributesData(attributesData)

      let attributes = deepClone(attributesList)
      // 遍历属性数据列表，给他们加上是否删除的标识
      attributesData.forEach((attributeData) => {
        const categoryAttribute = attributes.find(catetoryAttribute => catetoryAttribute.id === attributeData.attributeId)
        attributeData.attribute.deleted = !categoryAttribute
        if (!categoryAttribute) return
        const categoryAttributeTerms = categoryAttribute.terms || [];
        (attributeData.attributeTerms || []).forEach(attributeTerm => {
          attributeTerm.deleted = !categoryAttributeTerms.some(term => term.id === attributeTerm.id)
        })
      })
      // 已经删除的属性
      const hasDeletedAttributes = attributesData
        .filter((attribute) => attribute.attribute.deleted)
        .map((attribute) => {
          return {
            ...attribute.attribute,
            name: `${attribute.attribute.name}（已删除）`,
            required: false,
            usable: true,
            priority: 0,
            terms: (attribute.attributeTerms || []).map((term) => {
              return {
                id: term.id,
                name: `${term.name}（已删除）`,
                deleted: true
              }
            })
          }
        })
      // 已经删除了属性值的属性 (属性未删除，但是属性值是删除了的)
      const hasDeletedTermsdAttributes = attributesData
        .filter((attribute) => !attribute.attribute.deleted && (attribute.attributeTerms || []).some((term) => term.deleted))
      // 属性列表加上属性详情中已经被删掉的属性
      attributes = attributes.map((attribute) => {
        const hasDeletedTermsdAttribute = hasDeletedTermsdAttributes
          .find(deletedAttribute => deletedAttribute.attributeId === attribute.id)
        let terms = attribute.terms
        if (hasDeletedTermsdAttribute) {
          terms = terms.concat(hasDeletedTermsdAttribute.attributeTerms.filter(terms => terms.deleted).map((term) => {
            return {
              id: term.id,
              name: `${term.name}（已删除）`,
              deleted: true
            }
          }))
        }
        return {
          ...attribute,
          termValueType: attribute.termValueType.value,
          terms: terms
        }
      }).concat(hasDeletedAttributes)
      return attributes
    },
    /**
     * 暂存详情的属性数据
     * @param {Object} attributesData 详情属性数据
     */
    stashAttributesData (attributesData) {
      this.dataMap.clear()
      attributesData.forEach((attributeData) => {
        this.dataMap.set(`${attributeData.attributeId}`, attributeData)
      })
    },
    result () {
      return new Promise(resolve => {
        const data = this.form.attributesData.map((attribute) => {
          return {
            attributeId: attribute.attributeId,
            attributeValues: attribute.checkbox ? attribute.value : (attribute.value ? [attribute.value] : []),
            attributeTermType: attribute.termValueType,
            id: attribute.id
          }
        })
        resolve({ 'productCustomAttributes': data || [] })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ProductAttr {
  margin-bottom: 2rem;
  /deep/.el-col {
    height: 46px;
    .el-select {
      width: 100%;
    }
    .el-form-item__label {
      position: relative;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 25px;
      height: 45px;
      &::after {
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
  }
}
</style>
