<template>
  <div class="detailControl">
    <div :class="[isRight=== true ? 'detailCenteRight' : 'detailCenter']">
      <el-button type="primary" :size="size" @click="doSave">{{saveText}}</el-button>
      <el-button
        :type="type"
        :size="size"
        :class="[cancelText===true ? 'noneShow':'']"
        @click="gotoList"
      >{{cancelText}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlBaseDetails',
  props: {
    mode: { type: String, required: false, default: '' },
    gotoList: { type: Function, required: false },
    modify: { type: Function, required: false },
    load: { type: Function, required: false },
    create: { type: Function, required: false, default: undefined },
    references: { type: Object, required: false, default: undefined },
    form: { type: String, required: false, default: undefined },
    cancelText: { type: String, required: false, default: undefined },
    saveText: { type: String, required: false, default: undefined },
    type: { type: String, required: false, default: 'default' },
    size: { type: String, required: false, default: undefined },
    isRight: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      message: undefined
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.message = undefined
      setTimeout(_ => {
        if (this.mode !== 'create') {
          this.action = 'load'
          this.load()
        }
      }, 0)
    },
    doSave () {
      if (this.references && this.form) {
        this.references[this.form].validate(valid => {
          console.log('表单验证成功')
          if (valid) {
            this.ds()
          } else {
            console.log('表单验证错误')
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
