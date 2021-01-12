<template>
  <div>
    <!--
    [options] 备选数据项
    [multiple] 是否允许多选
    [flat] 平面模式
    [disable-branch-nodes] 是否禁止父节点的可选
    [props] select node 的参数key定义
    [load-options] 懒加载实现--原理：在初始化数据项时，将children数据进行卸载，点击选中时，再将数据装载上去
    -->
    <Treeselect
      v-model="treeVal"
      :options="options"
      :multiple="false"
      :flat="false"
      :disable-branch-nodes="false"
      :props="defaultProps"
      :placeholder="label"
      size="small"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'
export default {
  name: 'SlTreeSelect',
  components: { Treeselect },
  model: {
    prop: 'value',
    event: 'valChange'
  },
  props: {
    value: {
      type: [Array, Number, String, Object],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    treeVal: {
      set: function (value) {
        this.$emit('valChange', value)
      },
      get: function () {
        return this.value
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
/deep/.vue-treeselect__control {
  height: 30px;
}
</style>
