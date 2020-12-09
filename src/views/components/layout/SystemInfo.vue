<template>
  <h1 class="system-info" :class="{'collapse':menuCollapse}">
    <template v-if="menuCollapse">
      <img src="@/assets/home-short-logo.png" alt="logo" />
    </template>
    <img v-else src="@/assets/home-logo.png" alt="logo" />
  </h1>
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
  height: 5rem;
  line-height: 5rem;
  padding-left: 10%;
  color: #fff;
  background-color: #357ca5;

  img {
    height: 100%;
  }

  &.collapse {
    text-align: center;
    padding-left: 0;
  }
}
</style>
