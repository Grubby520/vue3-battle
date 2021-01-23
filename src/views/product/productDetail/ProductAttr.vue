<template>
  <div class="ProductAttr" v-if="form.attributesData.length>0">
    <el-card>
      <div slot="header" class="title">
        <span>商品属性</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" label-width="200px">
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
                  <span :title="attribute.name">{{attribute.name}}</span>
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
    ...mapGetters('product', ['customAttributesData', 'productCustomizeAttributeList'])
  },
  watch: {
    customAttributesData: {
      handler (attributesData) {
        const attributes = deepClone(attributesData)
        this.form.attributesData = attributes.filter((attribute) => attribute.usable) // 属性是可用的
          .sort((prev, next) => prev.priority - next.priority) // 根据优先级进行排序
          .map((attribute) => {
            const attributeData = this.dataMap.get(attribute.attributeId) || {}
            return {
              id: attributeData.id || null,
              attributeId: attribute.id,
              name: attribute.name,
              termValueType: attribute.termValueType.value,
              checkbox: attribute.checkbox,
              required: attribute.required,
              terms: attribute.terms,
              value: attributeData.attributeValues || attribute.checkbox ? [] : undefined
            }
          })
      },
      deep: true,
      immediate: true
    },
    productCustomizeAttributeList: {
      handler (attributesData) {
        this.dataMap.clear()
        attributesData.forEach((attributeData) => {
          this.dataMap.set(attributeData.attributeId, attributeData)
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
    result () {
      return new Promise(resolve => {
        const data = this.form.attributesData.map((attribute) => {
          return {
            attributeId: attribute.attributeId,
            attributeValues: attribute.checkbox ? attribute.value : [attribute.value],
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
  /deep/.el-select {
    width: 100%;
  }
}
</style>
