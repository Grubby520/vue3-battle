<template>
  <div class="cascader">
    <div class="cascader__body" v-for="(element, optionIndex) of options" :key="optionIndex">
      <div class="cascader__body-content">
        <div
          class="cascader__body-menu"
          :class="{'active':ca.isActive,'activeLast':ca.leaf && ca.isActive }"
          v-for="(ca,index) in element"
          :key="index"
          @click="change(ca, optionIndex)"
        >
          <span>{{ca.label}}</span>
          <i class="el-icon-arrow-right icon" v-if="!ca.leaf"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonApi from '@api/api'

export default {
  name: 'cascader',
  model: {
    prop: 'currentEl',
    events: 'nodeChange'
  },
  props: {
    currentEl: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },
  data () {
    return {
      options: [],
      isActive: false,
      final: false
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      CommonApi.category({ type: 1 })
        .then(res => {
          this.options.push(res.data)
          this.changeInitData(res.data)
        })
    },
    change (data, level) {
      const previousId = this.currentEl[level]
      const currentId = data.id
      if (previousId) {
        if (previousId === currentId) {
          data.isActive = true
        } else {
          // 切换菜单删除当前标识后的所有数据,并且更新最新数组
          this.currentEl.splice(level + 1)
          // 切换菜单删除当前菜单后的所有数据
          this.options.splice(level + 1)
          this.updateNodes(level, currentId, data)
        }
      } else {
        // 每层第一次点击数据
        this.updateNodes(level, currentId, data)
      }
      this.$emit('nodeChange', this.currentEl)
    },
    updateNodes (level, currentId, data) {
      // 当前点击父级节点下的所有值
      this.$set(this.currentEl, level, { id: currentId, label: data.label, categoryLevel: data.path, leaf: data.leaf })
      this.highlightSign(this.options, level, currentId)
      // 更新点击后的子级节点
      if (data.children.length > 0) this.$set(this.options, level + 1, data.children)
    },
    highlightSign (options, level, currentId) {
      options[level].forEach((cur, curIndex) => {
        // 子级同级切换，不是当前id就删除isActive
        cur.id !== currentId ? delete cur.isActive : this.$set(cur, 'isActive', true)
        // 删除子级的isActive
        cur.children.forEach((el, index) => {
          el.isActive && delete el.isActive
        })
      })
    },
    changeInitData (arr) {
      // 判断是否是最后节点
      arr.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.changeInitData(node.children)
        } else {
          node.leaf = true
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.odmOneDetails {
  width: 80%;
  margin: 0 auto;
  .cascader {
    display: flex;
    justify-content: flex-start;
    // 总高度为每行高度的倍数
    height: 476px;
    width: 100%;
    line-height: 34px;
    color: #606266;
    border: 1px solid #ccc;
    border-left: none;
    z-index: 100;
    &__body {
      width: 25%;
      &-content {
        // 隐藏滚动条
        overflow: hidden;
        &:hover {
          // hover滚动条不占内容区域
          overflow-y: overlay;
        }
        box-sizing: border-box;
        cursor: pointer;
        border-left: 1px solid #ccc;
        height: 100%;
      }
      &-menu {
        display: flex;
        justify-content: space-between;
        width: 100%;
        &:nth-child(2n-1) {
          background-color: #f4fcff;
        }
        &:nth-child(2n) {
          background-color: #fff;
        }
        span {
          display: inline-block;
          padding-left: 20px;
        }
      }
    }
    .active {
      font-weight: 70px;
      color: #fff;
      font-weight: bold;
      background-color: #65adf5;
    }
    .activeLast {
      font-weight: 70px;
      color: #fff;
      font-weight: bold;
      background-color: #268cf1;
    }
    .icon {
      line-height: 34px;
      padding-right: 10px;
    }
  }
}
</style>
