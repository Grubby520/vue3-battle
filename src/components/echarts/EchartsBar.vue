<template>
  <div ref="barChart" class="echarts-bar" :style="{height}">
      <sl-chart :options="barOption" :autoresize="true"></sl-chart>
  </div>
</template>

<script>
import { merge } from '@shared/util'
import { BaseOption } from './com'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

export default {
  name: 'EchartsBar',
  data () {
    return {
      defaultOption: {}, // 柱状图基础配置
      barOption: {}
    }
  },
  props: {
    options: null,
    height: {
      type: String,
      default: '200px'
    }
  },
  watch: {
    options: function (newValue) {
      this.barOption = merge({}, BaseOption, this.defaultOption, this.options)
    }
  },
  mounted () {
    this.barOption = merge({}, BaseOption, this.defaultOption, this.options)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
