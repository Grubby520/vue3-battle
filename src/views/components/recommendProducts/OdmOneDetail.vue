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
    <p class="odmOneDetail-des">当前选择分类：{{lables.length>0?lables:''}}</p>
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
      panel: [],
      lables: [],
      showData: [],
      mapData: [],
      nodeKeys: [],
      props: {
        value: 'id',
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
    axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/list')
      .then(res => {
        this.options = res.data.data
      })
  },
  watch: {
    'nodeKeys': {
      handler (newValue) {
        // 当前选择分类
        const label = []
        const showLabel = []
        newValue.forEach(node => {
          label.push(node)
          const keyStr = label.join('|')
          showLabel.push(this.mapData.get(keyStr))
        })
        this.lables = showLabel.join('>')
        this.lables = this.lables.substring(0, this.lables.lastIndexOf('>'))
      },
      deep: true
    }
  },
  methods: {
    save () {

    },
    lazyLoad (node, resolve) {
      // axios.get('http://152.136.21.21:8080/mock/5fc46906fd2b28481fbeea8e/category/list')
      //   .then(res => {
      // this.options = res.data.data
      const nodes = this.options.map(item => ({
        ...item,
        label: item.label,
        value: item.id,
        leaf: node.level >= 2
      }))
      resolve(nodes)
      // })
    },
    change (nodeKey) {
      const mapData = new Map()
      function deepEach (array, code = '') {
        array.forEach((node) => {
          const key = code ? `${code}|${node.id}` : `${code}${node.id}`
          mapData.set(key, node.label)
          const children = node.children
          if (children && children.length > 0) {
            deepEach(children, key)
          }
        })
      }
      deepEach(this.options)
      this.mapData = mapData
      this.nodeKeys = nodeKey
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
    width: 300px;
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
