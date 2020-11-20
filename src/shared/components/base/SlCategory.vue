<template>
  <div class="category">
    <el-select v-model="category" placeholder="请选择" clearable>
      <el-option
        v-for="(category,index) in categoryArr"
        :key="'category_'+index"
        :label="category.label"
        :value="category.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import categoryService from '@api/api.js'
console.log(categoryService)
export default {
  name: 'SlCategory',
  model: {
    prop: 'category',
    event: 'changeCategory'
  },
  data () {
    return {
      categoryArr: []
    }
  },
  created () {

  },
  mounted () {
    this.getCategory()
  },
  methods: {
    getCategory () {
      categoryService.category().then(res => {
        debugger
      })
    }
  }
}
</script>

<style scoped lang="scss">
.category {
}
</style>
