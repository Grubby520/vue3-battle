<template>
  <div class="user-status">
    <div class="user-avatar">
      <img src="@/assets/user-avatar.png" alt="头像" />
    </div>
    <div class="user-name" :class="{'menu-collapse':menuCollapse}">
      <span class="flex-1">{{userName}}</span>
      <div class="flex-1 status--online">ONLINE</div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapState: userMapState } = createNamespacedHelpers('user')

export default {
  name: 'UserStatus',
  props: {
  },
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState(['menuCollapse']),
    ...userMapState(['userName'])
  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
.flex-1 {
  flex: 1;
}

.user-status {
  display: flex;
  padding: 1em;
  color: #fff;
  background-color: #1b2e1e;
  border-bottom: 1px solid #1b2010;
  .user-avatar {
    width: 5rem;
    img {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 100%;
    }
  }

  .user-name {
    display: flex;
    flex-direction: column;
    flex: 1;
    transition: all;
    &.menu-collapse {
      display: none;
    }
    .status--online {
      position: relative;
      &::before {
        content: '';
        display: inline-block;
        width: 1rem;
        height: 1rem;
        margin-right: 0.5em;
        border-radius: 100%;
        background-color: #76b610;
      }
    }
  }
}
</style>
