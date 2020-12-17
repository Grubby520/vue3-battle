<template>
  <div class="odmOneDetails">
    <p class="odmOneDetails-title">选择类目</p>
    <Cascader v-model="currentNodes"></Cascader>
    <p class="odmOneDetails-des">当前选择分类：{{cateLabels}}</p>
    <div class="odmOneDetails-btn">
      <el-button @click="save" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import Cascader from './Cascader'

export default {
  components: { Cascader },
  props: {
    mode: { type: String, required: false, default: 'create' },
    id: { type: [Number, String], required: false, default: '' },
    categoryId: { type: [Number, String], required: false, default: undefined }
  },
  data () {
    return {
      currentNodes: []
    }
  },
  mounted () {
    this._throttle = this.throttle(() => { this.$message.error('请选择完整的类目！') }, 3000)
  },
  computed: {
    cateLabels () {
      return this.currentNodes.reduce((init, a) => init.concat(a.label), []).join('>')
    }
  },
  methods: {
    save () {
      const current = this.currentNodes[this.currentNodes.length - 1]
      if (current.leaf) {
        const categoryId = current.id > 0 ? current.id : this.categoryId
        this.$router.push({
          path: '/home/recommend-products/OdmDetail',
          query: {
            cateLabels: this.cateLabels,
            categoryId: categoryId,
            categoryLevel: current.categoryLevel,
            mode: this.mode,
            id: this.id
          }
        }
        )
      } else {
        this._throttle()
        // this.$message.error('请选择完整的类目！')
      }
    },
    throttle (fn, wait) {
      let init = 0
      return function () {
        let nowTimes = +new Date()
        if (nowTimes - init > wait) {
          fn.apply(this)
          init = nowTimes
        }
      }
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
