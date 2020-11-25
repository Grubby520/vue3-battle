<template>
  <div class="detailControl">
    <div :class="[isRight=== true ? 'detailCenteRight' : 'detailCenter']">
      <el-button type="primary" @click="doSave" :loading="loading">{{saveText}}</el-button>
      <el-button :class="[cancelText===true ? 'noneShow':'']" @click="cancel">{{cancelText}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlDetails',
  props: {
    mode: { type: String, required: false, default: '' },
    cancel: { type: Function, required: false },
    modify: { type: Function, required: false },
    load: { type: Function, required: false },
    create: { type: Function, required: false, default: undefined },
    references: { type: Object, required: false, default: undefined },
    form: { type: String, required: false, default: undefined },
    cancelText: { type: String, required: false, default: undefined },
    saveText: { type: String, required: false, default: undefined },
    isRight: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      setTimeout(_ => {
        if (this.mode !== 'create') {
          this.action = 'load'
          this.load()
        }
      }, 0)
    },
    doSave () {
      this.loading = true
      if (this.references && this.form) {
        this.references[this.form].validate(valid => {
          if (valid) {
            // 表单校验成功
            this.ds()
            this.loading = false
          } else {
            this.loading = false
            return false
          }
        })
      } else {
        this.ds()
      }
    },
    ds () {
      if (this.mode === 'create') {
        this.action = 'create'
        this.create()
      } else {
        this.action = 'modify'
        this.modify()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.detailControl {
  overflow: hidden;
  margin-top: 20px;
  .detailCenter {
    text-align: center;
    margin-bottom: 10px;
  }
  .detailCenteRight {
    float: right;
    margin: 10px;
  }
  .noneShow {
    display: none;
  }
}
</style>
