<template>
  <div class="sl-checked-list">
    <span
      v-if="label"
      class="checked-list__label"
      :class="{right:align==='right',left:align==='left'}"
    >{{label}}</span>
    <ul class="checked-list__value">
      <li
        class="checked-item"
        v-for="(item,index) in options"
        :key="'item-'+index"
        :class="{active:isActive(item.value)}"
        @click="itemClick(item)"
      >
        <slot :item="item">
          <span>{{item.label}}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SlCheckedList',
  model: {
    prop: 'value',
    event: 'changeValue'
  },
  props: {
    label: {
      type: String,
      required: false,
      default: undefined
    },
    value: {
      type: [Array, String],
      required: false,
      default: undefined
    },
    options: {
      type: Array,
      required: false,
      default: () => { return [] }// [{ label:'',value:'',extra:{} }]
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    align: {
      type: String,
      required: false,
      default: 'right'// left
    }
  },
  data () {
    return {

    }
  },
  computed: {
    isActive () {
      return (val) => {
        if (this.multiple) {
          return this.value.includes(val)
        }
        return val === this.value
      }
    }
  },
  mounted () {

  },
  methods: {
    itemClick (item) {
      let newValue
      if (this.multiple) {
        newValue = this.multipleMode(item)
      } else {
        newValue = this.singleModeClickHandle(item)
      }
      this.$emit('changeValue', newValue)
    },
    multipleModeClickHandle (item) {
      let index = this.value.find(val => val === item.value)
      let temp = JSON.parse(JSON.stringify(this.value))

      if (index === -1) {
        temp.push(item.value)
      } else {
        temp.splice(index, 1)
      }
      return temp
    },
    singleModeClickHandle (item) {
      let newVal
      if (this.value !== item.value) {
        newVal = item.value
      }
      return newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.sl-checked-list {
  .checked-list__label {
    display: inline-block;
    min-width: 100px;
    padding: 0 12px 0 0;
    line-height: 32px;
    box-sizing: border-box;
    &.right {
      text-align: right;
    }
  }

  .checked-list__value {
    display: inline-block;
    margin-bottom: 1em;
    .checked-item {
      display: inline-block;
      padding: 0 0.5em;
      line-height: 32px;
      cursor: pointer;
      &.active {
        color: #fff;
        background-color: #409eff;
      }
    }
  }
}
</style>
