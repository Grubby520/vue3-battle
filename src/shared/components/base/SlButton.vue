<template>
  <div class="sl-button" :class="['box-shadow-'+boxShadow]">
    <el-button v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'SlButton',
  props: {
    boxShadow: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  watch: {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style lang="scss">
.sl-button {
  display: inline-block;
  border-radius: 2px;
  &.box-shadow-primary {
    box-shadow: 0px 4px 13px rgba(24, 144, 255, 0.4);
  }
}
</style>
