<template>
  <div class="user-info color-text--white">
    <div>{{userInfo.company}}</div>
    <!-- <div>{{userInfo.status}}</div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserInfo',
  props: {

  },
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
.user-info {
  display: inline-block;
}
</style>
