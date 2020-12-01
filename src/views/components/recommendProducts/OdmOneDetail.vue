<template>
  <div class="odmOneDetail">
    <p class="odmOneDetail-title">选择类目</p>
    <el-cascader-panel
      ref="panel"
      :options="options"
      v-model="panel"
      :props="props"
      @change="change"
    />
    <p class="odmOneDetail-des">当前选择分类：{{cateLabels}}</p>
    <div class="odmOneDetail-btn">
      <el-button @click="save" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  components: {},

  data () {
    return {
      cateLabels: '',
      panel: [3, 0, 0, 8],
      mapData: [], // 每一级数据
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      options: []
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.load()
  },
  watch: {
    'cateLabels': {
      handler (newValue) {
        // console.log('vual', newValue)
        // this.cateLabels = newValue
      },
      deep: true
    }
  },
  methods: {
    lazyLoad (node, resolve) {
      this.sss = 'ffff'
      const { level } = node
      // setTimeout(() => {
      if (level === 0) {
        console.log('1')
        axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelOne')
          .then(res => {
            const list = res.data.data
            this.mapData.push([...list])
            const nodes = this.resultNodes(list, level)
            resolve(nodes)
          })
      } else if (level === 1) {
        console.log(2)
        axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelTwo')
          .then(res => {
            const list = res.data.data
            this.mapData.push([...list])
            const nodes = this.resultNodes(list, level)
            resolve(nodes)
          })
      } else if (level === 2) {
        axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelThree')
          .then(res => {
            const list = res.data.data
            this.mapData.push([...list])
            const nodes = this.resultNodes(list, level)
            resolve(nodes)
          })
      } else if (level === 3) {
        axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/levelFour')
          .then(res => {
            const list = res.data.data
            this.mapData.push([...list])
            const nodes = this.resultNodes(list, level)
            resolve(nodes)
            console.log(nodes)
          })
      }
      // }, 1000)
    },
    resultNodes (list, level) {
      const nodes = list.map(item => ({
        value: item.id,
        label: item.label,
        leaf: level >= 3
      }))
      return nodes
    },
    change (nodekeys) {
      // console.log('nodekeys', nodekeys)

      // const mapData = new Map()
      // function deepEach (array, code = '') {
      //   array.forEach((node) => {
      //     const key = code ? `${code}|${node.id}` : `${code}${node.id}`
      //     mapData.set(key, node.label)
      //     const children = node.children
      //     if (children && children.length > 0) {
      //       deepEach(children, key)
      //     }
      //   })
      // }
      // deepEach(this.options)
      // console.log('mapData', mapData)

      // 根据四级id获取每级符合条件的数据
      const nodesData = []
      nodekeys.forEach((node, index) => {
        const nodes = this.mapData[index].find(key => node === key.id)
        nodesData.push(nodes)
      })

      // 当前选择分类数据
      const cate = nodesData.reduce((init, a) => init.concat(a.label), [])
      this.cateLabels = cate.join('>')
    },
    save () {
      this.$router.push({ path: '/home/recommend-products/OdmDetail', query: {} })
    },
    load () {

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
