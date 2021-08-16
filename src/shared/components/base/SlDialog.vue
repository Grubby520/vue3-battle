<template>
  <el-dialog custom-class="sl-dialog--custom" v-bind="$attrs" v-on="$listeners" :width="width">
    <slot></slot>
    <div slot="footer">
      <slot name="bottom">
        <el-button @click="cancel">{{$t('button.cancelText')}}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">{{$t('button.enterText')}}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SlDialog',
  components: {},
  props: {
    width: {
      type: String,
      default: '560px'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {},
  methods: {
    cancel () {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss">
@import '@assets/scss/_var.scss';
.sl-dialog--custom {
  .el-dialog__header {
    padding: 0 0 0 2rem;
    line-height: 4rem;
    .el-dialog__title {
      font-size: 1.4rem;
      font-weight: normal;
      color: $color-white !important;
    }
    .el-dialog__headerbtn {
      top: 1.3rem;
      & i {
        font-size: 1.4rem;
        color: $color-white !important;
      }
    }
    background-color: $color-dialog-header-bg !important;
  }

  .el-dialog__body {
    border-bottom: 1px solid #ecf1f4;
  }

  .el-dialog__footer {
    padding-top: 2rem;
  }
}
</style>
