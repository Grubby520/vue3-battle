<template>
  <div class="odmOneDetail">
    <p class="odmOneDetail-title">选择类目</p>
    <el-cascader-panel
      ref="panel"
      :props="props"
      @change="change"
      v-model="showNodes"
      :options="options"
    />
    <p class="odmOneDetail-des">当前选择分类：{{cateLabels}}</p>
    <div class="odmOneDetail-btn">
      <el-button @click="save" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const UrlList = [
  'http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelOne',
  'http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelTwo',
  'http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelThree',
  'http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelFour'
]

export default {

  components: {},
  data () {
    const _this = this
    return {
      mapData: [],
      options: [],
      showNodes: [3, 0, 0, 0],
      cateLabels: '',
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          axios.get(UrlList[level])
            .then(res => {
              _this.mapData.push(res.data.data)
              if (res && res.data && res.data.data) {
                const nodes = res.data.data.map(item => ({
                  value: item.id,
                  label: item.label,
                  leaf: level > 2,
                  length: res.data.data.length,
                  data: null
                }))
                resolve(nodes)
              }
            })
        }
      },
      middle: []
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      const _this = this
      let cataArr = []
      let requestArray = []
      _this.showNodes.forEach((key, index) => {
        requestArray.push(axios.get(UrlList[index]))
      })

      Promise.all(requestArray).then((responses) => {
        responses.forEach((response, index) => {
          cataArr[index] = response.data.data
        })
        let nodes = JSON.parse(JSON.stringify(_this.showNodes))
        nodes.splice(3, 1)
        nodes.reverse().forEach((node, index) => {
          const length = cataArr.length
          cataArr[length - index - 2].forEach((data) => {
            if (data.id === node) {
              data.children = cataArr[length - index - 1]
            }
          })
        })

        this.options = cataArr[0]
        console.log('in this way', responses)
      })
    },
    change (nodekeys) {
      // 根据四级id获取每级符合条件的数据
      const nodesData = []
      if (this.mapData.length === 0) {
        this.mapData = [...this.$refs.panel.$data.menus]
      }
      nodekeys.forEach((node, index) => {
        const nodes = this.mapData[index].find(key => node === key.value)
        nodesData.push(nodes)
      })
      // 当前选择分类数据
      const cate = nodesData.reduce((init, a) => init.concat(a.label), [])
      this.cateLabels = cate.join('>')
    },
    save () {
      const cateId = this.nodeKeys[3]
      if (this.nodeKeys && this.nodeKeys.length > 0) {
        this.$router.push({ path: '/home/recommend-products/OdmDetail', query: { cateLabels: this.cateLabels, cateId: cateId } })
      }
    }
  },
  watch: {
    options: {
      handler (newVal) {
        this.middle = newVal
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.odmOneDetail {
  // text-align: center;
  /deep/.el-cascader-node.in-active-path,
  .el-cascader-node.is-active,
  .el-cascader-node.is-selectable.in-checked-path {
    color: #fff;
    background-color: #409eff;
  }
  /deep/.is-active {
    color: #fff;
    background-color: #409eff;
  }
  /deep/.el-cascader-node__prefix {
    display: none;
  }
  /deep/.el-cascader-panel {
    height: 500px;
    width: 90%;
    margin: 0 auto;
  }
  /deep/.el-cascader-menu__wrap {
    height: 500px;
  }
  /deep/.el-cascader-menu__list {
    width: 300px; // 设置宽度防止li内容不同页面抖动
  }
  &-title {
    font-size: 18px;
    color: #409eff;
    font-weight: bold;
    margin: 20px 80px;
  }
  &-des {
    margin: 20px 0;
    font-size: 15px;
    text-align: left;
    margin-left: 80px;
  }
  &-btn {
    text-align: center;
  }
}
</style>
