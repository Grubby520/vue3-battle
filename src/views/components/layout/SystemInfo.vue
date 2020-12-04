<template>
  <h1 class="system-info">{{menuCollapse?'SRM':systemName}}</h1>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SystemInfo',
  props: {

  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['systemName', 'menuCollapse'])
  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_fn.scss';
.system-info {
  line-height: pxToRem(50px);
  color: #fff;
  text-align: center;
  background-color: #357ca5;
}
</style>
