<template>
  <div class="odmDetail">
    <OdmDetailBase :isStatus="isStatus" />
    <OdmDetailAttr :isStatus="isStatus" />
  </div>
</template>

<script>
import OdmDetailBase from './OdmDetailBase'
import OdmDetailAttr from './OdmDetailAttr'
export default {
  components: { OdmDetailBase, OdmDetailAttr },
  data () {
    return {

    }
  },
  computed: {
    isStatus () {
      if (this.mode !== 'view') {
        return true
      } else {
        return false
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.odmDetail {
  // padding: 20px 40px;
  border: 1px solid #dcdfe6;
}
</style>
