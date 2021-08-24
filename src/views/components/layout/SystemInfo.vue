<template>
  <h1 class="system-info" :class="{'collapse':menuCollapse}">
    <img
      class="system-logo cursor-pointer"
      src="@/assets/logo.svg"
      alt="logo"
      @click="triggerMenuCollapse"
    />
    <template v-if="!menuCollapse">
      <span class="display-inline-block ml-8px font-size-18">{{systemName}}</span>
      <span class="float-right mr-1rem cursor-pointer" @click="triggerMenuCollapse">
        <SlSvgIcon iconClass="icon-sl-shrink"></SlSvgIcon>
      </span>
    </template>
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
    triggerMenuCollapse () {
      this.$store.commit('SET_MENU_COLLAPSE', !this.menuCollapse)
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_fn.scss';
@import '@assets/scss/_var.scss';

.system-info {
  height: 6.4rem;
  line-height: 6.4rem;
  padding-left: 1.2rem;
  color: $color-white;
  background-color: $color-bg-logo;

  &.collapse {
    text-align: center;
    padding-left: 0;
  }

  .system-logo {
    height: 4.2rem;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
