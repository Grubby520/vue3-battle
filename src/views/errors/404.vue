<template>
  <div class="align-center">
    <div class="page-404__header align-left">
      <b>404页面</b>
    </div>
    <div class="page-404__body">
      <img src="@/assets/404.svg" alt="404" srcset />
      <h1 class="mt-2rem">404</h1>
      <p class="mt-1rem" style="color: rgba(0, 0, 0, 0.45);">抱歉，暂未找到你访问的页面</p>
    </div>
    <div class="page-404__footer mt-2rem">
      <el-button @click="gotoEntryRoute" type="primary">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import { getSessionItem } from '@shared/util'

export default {
  name: 'PageNofound',
  props: {

  },
  data () {
    return {

    }
  },
  computed: {},
  watch: {

  },
  methods: {
    gotoEntryRoute () {
      if (getSessionItem('supplierType') === 'OEM') {
        this.$router.push('/home/oem-delivery-manage/pending-order-list')
        return
      }
      this.$router.push('/home/recommend-products/list')
    }
  },
  mounted () {

  },
  destroyed () {

  }
}
</script>

<style scoped lang="scss">
.page-404__header {
  padding-left: 2.4rem;
  line-height: 4.8rem;
  background-color: rgba(0, 171, 85, 0.2);
}

.page-404__body {
  margin-top: 8rem;
}
</style>
