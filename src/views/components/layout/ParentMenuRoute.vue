<template>
  <section class="parent-menu-route">
    <transition>
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'ParentMenuRoute',
  computed: {
    key () {
      return this.$route.fullPath
    }
  }
}
</script>
<style scoped lang="scss">
.parent-menu-route {
  min-height: 100%;
}
</style>
