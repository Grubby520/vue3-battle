<template>
  <div class="user-info color-text--white align-right">
    <div>{{userInfo.company}}</div>
    <div class="color-text--gray">{{userInfo.status}}</div>
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
  line-height: 1.25;
  transform: translateY(25%);
}
</style>
