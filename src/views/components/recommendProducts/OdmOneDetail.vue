<template>
  <div class="odmOneDetail">
    <p class="odmOneDetail-title">选择类目</p>
    <el-cascader-panel ref="panel" :props="props" @change="change" v-model="nodeDates" />
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
    return {
      cateLabels: '',
      nodeDates: [3, 0, 0, 1],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          console.log(11111)
          axios.get(UrlList[level])
            .then(res => {
              if (res && res.data && res.data.data) {
                const nodes = res.data.data.map(item => ({
                  value: item.id,
                  label: item.label,
                  leaf: level > 2,
                  length: res.data.data.length
                }))
                resolve(nodes)
              }
            })
        }
      }
    }
  },
  methods: {
    change (nodekeys) {
      console.log(nodekeys)
      // 根据四级id获取每级符合条件的数据
      const nodesData = []
      const mapData = [...this.$refs.panel.$data.menus]
      nodekeys.forEach((node, index) => {
        const nodes = mapData[index].find(key => node.id === key.id)
        nodesData.push(nodes)
      })
      // 当前选择分类数据
      const cate = nodesData.reduce((init, a) => init.concat(a.label), [])
      this.cateLabels = cate.join('>')
    },
    save () {
      this.$router.push({ path: '/home/recommend-products/OdmDetail', query: {} })
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
