<template>
  <div class="user-operations">
    <el-dropdown>
      <span class="el-dropdown-link">
        <div class="user-avatar">
          <img src="@/assets/user-avatar.png" alt="头像" />
        </div>
        <i class="el-icon-caret-bottom color-text--white"></i>
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
  data: () => {
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
.user-operations {
  display: inline-block;
  cursor: pointer;
}

.user-avatar {
  display: inline-block;
  img {
    height: 2.5rem;
    width: 2.5rem;
    vertical-align: middle;
    border-radius: 100%;
  }
}
</style>
