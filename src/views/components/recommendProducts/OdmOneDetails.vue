<template>
  <div class="odmOneDetails">
    <p class="odmOneDetails-title">选择类目</p>
    <el-cascader-panel
      v-model="cascaderIds"
      :options="options"
      :props="panelProps"
      @change="change"
      @expand-change="expandChange"
      ref="cascader"
    />
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
    mode: { type: String, required: false, default: 'create' },
    id: { type: [Number, String], required: false, default: '' },
    categoryId: { type: [Number, String], required: false, default: undefined }
  },
  data () {
    return {
      options: [],
      nodeKeys: [],
      cascaderIds: [],
      panelProps: {
        value: 'id'
      },
      cate: {},
      categoryLevel: '',
      isLeaf: false
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      CommonApi.category({ type: 1 })
        .then(res => {
          this.options = res.data
          this.changeInitData(res.data)
        })
    },
    changeInitData (arr) {
      // 删除树形数组最后一级children为空的字段
      arr.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.changeInitData(node.children)
        } else {
          delete node.children
        }
      })
    },

    change (nodeKeys) {
      this.showlabels(this.options, nodeKeys)
      this.checkIsLeaf(nodeKeys)
    },
    expandChange (val) {
      this.isLeaf = false
      if (val.length === 0) this.checkIsLeaf(this.cascaderIds)
    },
    checkIsLeaf (nodeKeys) {
      let treeLeader = { isLeaf: false }
      this.showCateLables(this.options, nodeKeys[nodeKeys.length - 1], treeLeader)
      this.isLeaf = treeLeader.isLeaf
      if (treeLeader.isLeaf) {
        this.nodeKeys = nodeKeys
      }
    },
    showCateLables (arr, id, treeLeader) {
      if (treeLeader.isLeaf) return false
      arr.forEach(cate => {
        if (cate.id === parseInt(id)) {
          // 最后一级节点
          treeLeader.isLeaf = true
          this.categoryLevel = cate.path
          return false
        } else if (cate.children && cate.children.length > 0) {
          this.showCateLables(cate.children, id, treeLeader)
        }
      })
    },
    save () {
      if (this.isLeaf) {
        const categoryId = this.nodeKeys.length > 0 ? this.nodeKeys[this.nodeKeys.length - 1] : this.categoryId
        this.$router.push({
          path: '/home/recommend-products/OdmDetail',
          query: {
            cateLabels: this.cate.cateLabels,
            categoryId: categoryId,
            categoryLevel: this.categoryLevel,
            mode: this.mode,
            id: this.id
          }
        }
        )
      } else {
        this.$message.error('请选择完整的类目！')
      }
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
  margin: 0 auto;
  width: 1500px;
  /deep/.el-cascader-panel {
    height: 500px;
    width: 90%;
    margin: 0 auto;
  }
  /deep/.el-cascader-menu__wrap {
    height: 500px;
  }
  /deep/ .el-cascader-menu {
    width: 25%;
  }
  &-title {
    font-size: 18px;
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
