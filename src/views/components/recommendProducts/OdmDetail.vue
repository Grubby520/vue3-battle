<template>
  <div class="odmDetail" :class="{'view-container': false}">
    <OdmDetailBase :isStatus="isStatus" ref="OdmDetailBase" />
    <OdmDetailAttr :isStatus="isStatus" ref="OdmDetailAttr" />
    <OdmDetailProductAttr :isStatus="isStatus" ref="OdmDetailProductAttr" />
    <div class="odmDetail-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submit" type="primary">保存</el-button>
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
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
      ref: []
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
  mounted () {
    this.load()
  },
  methods: {
    submit () {
      const OdmDetailBase = new Promise((resolve, reject) => {
        this.$refs['OdmDetailBase'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      const OdmDetailAttr = new Promise((resolve, reject) => {
        this.$refs['OdmDetailAttr'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      const OdmDetailProductAttr = new Promise((resolve, reject) => {
        this.$refs['OdmDetailProductAttr'].$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })

      Promise.all([OdmDetailBase, OdmDetailAttr, OdmDetailProductAttr])
        .then(() => {
          console.log('验证通过,提交表单')
          if (this.mode === 'create') {
            this.create()
          } else {
            this.modify()
          }
        })
        .catch(err => {
          console.log('验证失败', err)
        })
    },
    load () {

    },
    create () {

    },
    modify () {

    },
    cancel () {
      this.$router.push({ path: '/home/recommend-products/list', query: {} })
    }
  }
}
</script>

<style scoped lang="scss">
.odmDetail {
  border: 1px solid #dcdfe6;
  &-btn {
    text-align: center;
    margin: 20px;
  }
}

.view-container {
  pointer-events: none;
  /deep/.el-input__inner {
    border: 0;
  }
}
</style>
