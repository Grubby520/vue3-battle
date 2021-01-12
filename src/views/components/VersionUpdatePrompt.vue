<template>
  <div v-show="hasVersionUpdated">
    <a class="top-alert__version" v-if="hasVersionUpdated && !dialogVisible" @click="update">
      <i class="el-icon-warning" /> 有新版本更新, 点击刷新页面获取最新版本
    </a>
    <el-dialog
      title="版本更新"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="30%"
    >
      <div class="align-center color-text--red">
        <h1 class="mb-2rem">有新版本啦 ！！！</h1>
        <el-button type="primary" @click="update">立刻更新</el-button>
        <el-button @click="notUpdated">暂时不更新</el-button>
      </div>
      <div class="mt-2rem">
        <el-alert title="说明" type="info" description="选择暂时不更新，稍后可以通过点击导航栏中部的链接更新。" show-icon></el-alert>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VersionUpdatePrompt',
  props: {

  },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState(['hasVersionUpdated'])
  },
  watch: {
    hasVersionUpdated (val) {
      if (val) {
        this.dialogVisible = true
      }
    }
  },
  methods: {
    update () {
      window.location.reload(true)
    },
    notUpdated () {
      this.dialogVisible = false
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
$color-green: #76b610;

.top-alert__version {
  display: inline-block;
  position: fixed;
  left: 50%;
  top: 2rem;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: $color-white;
  text-decoration: underline;
  animation: color-change 3s infinite;
  cursor: pointer;
  z-index: 10;
}

@keyframes color-change {
  from {
    color: $color-green;
  }
  to {
    color: $color-white;
  }
}
</style>
