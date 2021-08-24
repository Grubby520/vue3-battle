<template>
  <div class="sl-switch-nav color-bg--white clearfix">
    <div v-if="$slots.left" class="float-content left-position">
      <slot name="left"></slot>
    </div>
    <el-menu
      mode="horizontal"
      :class="{'align-right':align === 'right'}"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-menu-item v-for="(item,index) in navs" :key="'index'+index" :index="String(item.tabType)">
        <slot name="custom" v-bind:tab="item">{{item.tabName}}</slot>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SlSwitchNav',
  props: {
    align: {
      type: String,
      default: 'left'
    },
    navs: {
      type: Array,
      default: () => []
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.sl-switch-nav {
  position: relative;
  margin-bottom: 0.2rem;
  & /deep/ {
    .el-menu {
      display: inline-block;
      border-bottom: none;
      &.align-right {
        float: right;
      }
    }
  }
}

.float-content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  &.left-position {
    left: 0;
  }
  &.right-position {
    right: 0;
  }
}
</style>
