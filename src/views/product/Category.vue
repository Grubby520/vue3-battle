<template>
  <div class="odmOneDetails">
    <p class="odmOneDetails-title">选择类目</p>
    <CategoryCascader v-model="currentNodes"></CategoryCascader>
    <p class="odmOneDetails-des">当前选择分类：{{cateLabels}}</p>
    <div class="odmOneDetails-btn">
      <el-button @click="save" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import CategoryCascader from './CategoryCascader'
import { throttle } from '@/shared/util'
export default {
  props: {
    mode: { type: String, required: false, default: 'create' },
    id: { type: [Number, String], required: false, default: '' },
    categoryId: { type: [Number, String], required: false, default: undefined }
  },
  components: { CategoryCascader },
  data () {
    return {
      currentNodes: []
    }
  },
  mounted () {
    this._throttle = throttle(this.throttleMessage, 3000)
  },
  computed: {
    cateLabels () {
      return this.currentNodes.reduce((init, a) => init.concat(a.name), []).join('>')
    }
  },
  methods: {
    save () {
      const current = this.currentNodes[this.currentNodes.length - 1]
      if (current && current.leaf) {
        const categoryId = current.id
        this.$router.push({
          path: '/home/recommend-products/productDetail',
          query: {
            cateLabels: this.cateLabels,
            categoryId: categoryId,
            categoryPath: current.categoryLevel,
            mode: this.mode,
            id: this.id
          }
        })
      } else {
        this._throttle()
      }
    },
    throttleMessage () {
      this.$message.error('请选择完整的类目！')
    }
  }
}
</script>

<style scoped lang="scss">
.odmOneDetails {
  width: 80%;
  margin: 0 auto;
  &-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  &-des {
    margin: 20px 0;
    font-size: 15px;
    text-align: left;
  }
  &-btn {
    text-align: center;
  }
}
</style>
