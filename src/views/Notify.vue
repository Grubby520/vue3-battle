<template>
  <div class="notify-container">
    <RegisterHeader></RegisterHeader>
    <div class="notify-content align-center">
      <span class="el-icon-success"></span>
      <div>
        <b v-if="'register-submit-success' === notifyModel.msgType">{{notifyModel.msgContent}}</b>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterHeader from '@/views/components/register/RegisterHeader.vue'
export default {
  name: 'Notify',
  components: {
    RegisterHeader
  },
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    notifyModel () {
      let msgType = this.$route.query.msgType
      let model = {}
      switch (msgType) {
        case 'register-submit-success':
          model = {
            msgType,
            msgContent: '您的申请已成功提交'
          }
          break
      }
      return model
    }
  },
  mounted () {

  },
  methods: {

  }

}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
@import '@assets/scss/_mixin.scss';
.notify-container {
  height: 100%;
  background-color: $color-white;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.el-icon-success {
  font-size: 6em;
  color: $color-success;
}

.notify-content {
  margin-top: 8rem;
  padding-top: 6em;
}
</style>
