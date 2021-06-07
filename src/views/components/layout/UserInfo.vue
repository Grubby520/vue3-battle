<template>
  <div class="user-info">
    <div class="user-avatar">
      <el-avatar :size="34" :src="avatarUrl"></el-avatar>
    </div>
    <div class="display-inline-block ml-8px align-right">
      <span class="align-middle text-overflow" :title="supplierName" style="max-width:20em">
        <span class="color-text--minor">你好，</span>
        {{isAdmin?'管理员':supplierName}}
      </span>
      <el-divider direction="vertical"></el-divider>
      <span v-if="!isAdmin" class="display-inline-block color-text--primary">{{supplierStatus}}</span>
    </div>
    <UserOperations></UserOperations>
  </div>
</template>

<script>
import UserOperations from '@/views/components/layout/UserOperations.vue'
import { createNamespacedHelpers } from 'vuex'
import avatarUrl from '@/assets/user-avatar.png'
const { mapState } = createNamespacedHelpers('user')

export default {
  name: 'UserInfo',
  props: {
  },
  components: {
    UserOperations
  },
  data () {
    return {
      avatarUrl
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
@import '@assets/scss/_var.scss';

$color-F3F6F9: #f3f6f9;

.user-info {
  padding-right: 1rem;
  line-height: 1;
  border-radius: 1.7rem;
  background-color: $color-F3F6F9;
}

.user-avatar {
  display: inline-block;
  line-height: 0;
  vertical-align: middle;
  .el-avatar--circle {
    border: 2px solid $color-primary;
    border-radius: 100%;
  }
}
</style>
