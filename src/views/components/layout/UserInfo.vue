<template>
  <div v-if="!isAdmin" class="user-info color-text--white align-right">
    <div>{{supplierName}}</div>
    <div class="color-text--gray">{{supplierStatus}}</div>
  </div>
  <div v-else class="display-inline-block color-text--white align-right">管理员</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'UserInfo',
  props: {
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['supplierName', 'supplierStatus', 'isAdmin'])
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
