<template>
  <div class="register-result">
    <div class="align-center">
      <span class="el-icon-success"></span>
      <div>
        <div v-if="[1,5].includes(supplierStatusCode)" class="display-inline-block">
          {{supplierStatus}}&nbsp;&nbsp;
          <el-button type="text" @click.native="register">点击此处重新提交资料</el-button>
        </div>
        <b v-if="isSubmit">您的申请已成功提交</b>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: userMapState } = createNamespacedHelpers('user')

export default {
  name: 'RegisterResult',
  props: {
    isSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...userMapState(['supplierStatusCode', 'supplierStatus'])
  },
  methods: {
    register () {
      this.$router.push('/register')
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
.el-icon-success {
  font-size: 6em;
  color: $color-success;
}

.register-result {
  padding-top: 6em;
}
</style>
