<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="fullSymbolId" />
  </svg>
</template>

<script>
export default {
  name: 'SlSvgIcon',
  props: {
    iconPrefix: {// 在iconfont上配置,阿里的字体服务
      type: String,
      default: 'icon-sl-'
    },
    iconClass: {
      type: String,
      required: true
    },
    extendClassName: {// 自定义样式类名
      type: String
    }
  },
  computed: {
    fullSymbolId () {
      return `#${this.iconPrefix}${this.iconClass}`
    },
    svgClass () {
      if (this.extendClassName) {
        return 'svg-icon ' + this.extendClassName
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
