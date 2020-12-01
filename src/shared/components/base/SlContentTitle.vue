<template>
  <div class="sl-content-title">
    <span class="content-title-text" :style="{fontSize,color}">{{text}}</span>
    <hr v-if="line" class="content-title-line" :style="lineStyle" />
  </div>
</template>

<script>
export default {
  name: 'SlContentTitle',
  props: {
    text: {
      type: String,
      default: ''
    },
    line: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: String,
      default: '1.25em'
    },
    color: {
      type: String,
      default: '#999'
    },
    lineStyle: {
      type: Object,
      default: () => ({
        borderColor: '#ddd',
        opacity: '0.2'
      })
    }
  },
  data: () => {
    return {

    }
  },
  computed: {

  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
.sl-content-title {
  position: relative;
  margin-bottom: 1em;
  .content-title-text {
    position: relative;
    display: inline-block;
    padding: 1em 1em 1em 0;
    color: $color-gray;
    background-color: $color-white;
    z-index: 2;
  }

  .content-title-line {
    position: absolute;
    top: 50%;
    width: 100%;
    margin: 0;
    transform: translateY(-50%);
  }
}
</style>
