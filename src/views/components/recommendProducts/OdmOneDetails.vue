<template>
  <div class="odmOneDetails">
    <p class="odmOneDetails-title">选择类目</p>
    <el-cascader-panel :options="options" :props="panelProps" @change="change" v-model="showNodes"></el-cascader-panel>
    <p class="odmOneDetails-des">当前选择分类：{{cate.cateLabels}}</p>
    <div class="odmOneDetails-btn">
      <el-button @click="save" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
import CommonApi from '@api/api'

export default {
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: [Number, String], required: false, default: '' },
    categoryId: { type: [Number, String], required: false, default: undefined }
  },
  data () {
    return {
      options: [],
      nodeKeys: [],
      panelProps: {
        value: 'id'
      },
      cate: {},
      showNodes: []
    }
  },
  created () {
    this.load()
      .then((res) => {
        if (this.mode === 'modify') {
          const notes = this.showCateLables(res, this.categoryId, [])
          this.showNodes = notes.reverse()
        }
      })
  },
  methods: {
    load () {
      return CommonApi.category({ type: 1 })
        .then(res => {
          const list = res.data
          this.options = list
          this.changeInitData(list)
          this.showlabels(this.options, this.showNodes)
          return list
        })
    },
    changeInitData (arr, id) {
      arr.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.changeInitData(node.children)
        } else {
          delete node.children
        }
      })
    },
    showCateLables (arr, id, notes) {
      arr.forEach(cate => {
        if (cate.id === parseInt(id)) {
          notes.push(cate.id)
          return false
        } else if (cate.children && cate.children.length > 0) {
          this.showCateLables(cate.children, id, notes)
          notes.push(cate.id)
        }
      })
      return notes
    },
    change (nodeKeys) {
      this.nodeKeys = nodeKeys
      this.showlabels(this.options, nodeKeys)
    },
    save () {
      const categoryId = this.nodeKeys[this.nodeKeys.length - 1]
      this.$router.push({ path: '/home/recommend-products/OdmDetail', query: { cateLabels: this.cate.cateLabels, categoryId: categoryId, mode: this.mode, id: this.id } })
    },
    showlabels (array, nodeKeys) {
      const labelarr = []
      const labelkey = []
      // 原始数组map数组 [{"3|37" => "拖鞋-无二次工艺标签"}]
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
      // 获取各级label
      nodeKeys.forEach((key, index) => {
        labelkey.push(key)
        labelarr.push(mapData.get(index > 0 ? labelkey.join('|') : labelkey.join('')))
      })
      this.$set(this.cate, 'cateLabels', labelarr.join('>'))
    }
  }
}
</script>

<style scoped lang="scss">
.odmOneDetails {
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
