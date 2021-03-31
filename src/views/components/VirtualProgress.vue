<template>
  <el-progress
    :text-inside="false"
    :percentage="currentPercentage"
    :show-text="showText"
    :class="{'complete':status === 'success'}"
    color="#67c23a"
  ></el-progress>
</template>

<script>
export default {
  name: 'VirtualProgress',
  props: {
    showText: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: null
    },
    speed: {
      type: Number,
      default: 5
    },
    rateTime: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      currentPercentage: 0,
      timerId: null
    }
  },
  computed: {},
  watch: {
    status (val) {
      if (val === 'success') {
        this.completed()
      }
    }
  },
  methods: {
    initTimer () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.computedPercentage()
      }, this.rateTime)
    },
    computedPercentage () {
      if (this.status === 'success') {
        this.completed()
        clearInterval(this.timerId)
        return
      }
      if (this.currentPercentage < 50) {
        this.currentPercentage += this.speed
      }

      if (this.currentPercentage >= 50 && this.currentPercentage < 98) {
        this.currentPercentage += this.speed / 2
      }

      if (this.currentPercentage >= 98 && this.currentPercentage < 100) {
        this.currentPercentage += this.speed / 5
      }

      this.currentPercentage = Math.floor(this.currentPercentage)

      if (this.currentPercentage >= 100) {
        this.currentPercentage = 99
      }
    },
    completed () {
      this.currentPercentage = 100
    }
  },
  mounted () {
    this.initTimer()
  },
  destroyed () {
    clearInterval(this.timerId)
  }
}
</script>

<style scoped lang="scss">
.complete {
  display: none;
  transition: display 0.5s;
}
</style>
