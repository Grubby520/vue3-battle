<template>
  <div>
    <el-steps :active="active" align-center>
      <el-step v-for="(step,index) in data" :key="'step_'+index" :title="step.title"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: [Number, String],
      default: null
    }
  },
  data: () => {
    return {

    }
  },
  computed: {

  },
  methods: {
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
@import '@assets/scss/_var.scss';
</style>
