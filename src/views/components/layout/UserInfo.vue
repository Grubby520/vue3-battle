<template>
  <div class="user-info color-text--white align-right">
    <div>{{supplierName}}</div>
    <div class="color-text--gray">{{supplierStatus}}</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'UserInfo',
  props: {
  },
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState(['supplierName', 'supplierStatus'])
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
