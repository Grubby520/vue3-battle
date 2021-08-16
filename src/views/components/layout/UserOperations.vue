<template>
  <div class="user-operations">
    <el-dropdown>
      <span class="el-dropdown-link">
        <i class="el-icon-caret-bottom color-text--weak"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="modifyPassword">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="signOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'UserOperations',
  props: {

  },
  data () {
    return {

    }
  },
  computed: {
  },
  methods: {
    ...userMapActions(['SIGN_OUT']),
    modifyPassword () {
      this.$router.push('/modify-password')
    },
    signOut () {
      this.SIGN_OUT().then(res => {
        if (res) {
          this.$router.push('/login')
        }
      })
    }
  },
  mounted: function () {

  }
}
</script>
<style scoped lang="scss">
@import '@assets/scss/_var.scss';

.user-operations {
  display: inline-block;
  cursor: pointer;
  &:hover {
    .el-icon-caret-bottom {
      color: $color-primary;
    }
  }
}
</style>
