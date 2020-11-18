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
        <el-dropdown-item @click.native="quit">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
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
    modifyPassword () {
      this.$router.push('/modifyPassword')
    },
    quit () {
      this.$router.push('/login')
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
