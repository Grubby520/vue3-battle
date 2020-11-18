<template>
  <!-- 上传SPU -->
  <div class="import-spu">
    <!-- 页面的步骤 -->
    <el-row type="flex" justify="center" class="import-spu__steps">
      <el-col :md="24" :lg="18" :xl="18">
        <el-steps :active="active_step" finish-status="success" simple>
          <el-step title="上传数据"></el-step>
          <el-step title="导入完成"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <!-- 页面主体内容 -->
    <component :is="active_template" @submit="submit"></component>
  </div>
</template>

<script>
import UploadData from '@/views/components/importSpu/UploadData'
import UploadResult from '@/views/components/importSpu/UploadResult'
export default {
  name: 'importSpu',
  components: {
    // 上传数据
    UploadData,
    // 上传结果
    UploadResult
  },
  data () {
    return {
      // 当前步骤
      active_step: 1,
      // 当前主体内容
      active_template: 'UploadData'
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 提交业务进入到下一步
    submit () {
      this.active_step = 2
      this.active_template = 'UploadResult'
    }
  }
}
</script>

<style scoped lang="scss">
.import-spu {
  &__steps {
    padding: 4rem 0;
    border: 1px dashed #797979;

    /deep/.is-process {
      color: #d3d3d3;
      border-color: #d3d3d3;
    }
  }
}
</style>
