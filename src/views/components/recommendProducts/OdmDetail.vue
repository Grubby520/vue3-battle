<template>
  <div class="odmDetail" :class="{'view-container': false}">
    <OdmDetailBase :isStatus="isStatus" />
    <OdmDetailAttr :isStatus="isStatus" />
    <OdmDetailProductAttr :isStatus="isStatus" />
  </div>
</template>

<script>
import OdmDetailBase from './OdmDetailBase'
import OdmDetailAttr from './OdmDetailAttr'
import OdmDetailProductAttr from './OdmDetailProductAttr'
export default {
  components: { OdmDetailBase, OdmDetailAttr, OdmDetailProductAttr },
  props: {
    mode: { type: String, required: false, default: '' },
    id: { type: String, required: false, default: '' }
  },
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
  border: 1px solid #dcdfe6;
}

.view-container {
  pointer-events: none;
  /deep/.el-input__inner {
    border: 0;
  }
}
</style>
