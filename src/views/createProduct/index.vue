<template>
  <div>
    <SalesAttributes
      :mode="mode"
      :categoryId="categoryId"
      :productId="productId"
      :initialValue="initSaleAttr"
    ></SalesAttributes>
    <ProductAttributes
      ref="customAttributesInfo"
      :canUpdate="true"
      :canView="false"
      :categoryId="categoryId"
      :productId="productId"
      :initialValue="productCustomizeAttributeList"
    ></ProductAttributes>
  </div>
</template>

<script>
import SalesAttributes from '@/views/createProduct/SalesAttributes'
import ProductAttributes from '@/views/createProduct/ProductAttributes'

export default {
  name: 'Index',
  components: {
    SalesAttributes,
    ProductAttributes
  },
  data () {
    return {
      // edit：可编辑，view：只能查看
      mode: 'edit',
      categoryId: 54,
      productId: 22,
      // 销售属性：表格
      // productSalesAttributeList: [],
      // 销售属性：商品图片
      // colorImageList: {},
      initSaleAttr: {
        productSalesAttributeList: [],
        productImageList: {}
      },
      productCustomizeAttributeList: [
        {
          categoryId: 0,
          customizeAttributeId: 0,
          customizeAttributeValue: '',
          id: 0,
          productId: 0,
          status: 0
        }
      ]
    }
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

  }
}
</script>

<style scoped lang="scss">
</style>
