<template>
  <div class="uploadImages">
    <div class="uploadImages__zip"></div>
    <div class="uploadImages__detail">
      <div class="flex-left">
        <div class="uploadImages__detail-left flex-center">
          <div class="uploadImages__detail-progress">
            <p>{{'P12345.zip'}}</p>
            <el-progress :percentage="percentage" />
          </div>
        </div>
        <div class="uploadImages__detail-right">
          <p>上传中</p>
          <p>已经上传80%</p>
        </div>
      </div>
    </div>
    <div class="uploadImages__process">
      <p>如何创建图片压缩包</p>
      <div class="flex-left">
        <div class="uploadImages__process-img">
          <div v-for="(img,imIndex ) in processImages" :key="imIndex">
            <div class="flex-left">
              <img :src="img.src" />
              <p class="uploadImages__process-description">{{img.title}}</p>
            </div>
          </div>
        </div>
        <img class="center" :src="require('@assets/recommend-arrows.png')" />
        <div class="center">
          <img :src="require('@assets/recommend-smallfolder.png')" />
          <p>文件夹以供方SPU编号命名</p>
        </div>
        <img :src="require('@assets/recommend-arrow.png')" />
        <div class="center">
          <img :src="require('@assets/recommend-smallcompression.png')" />
          <p>压缩包以供方SPU编号命名</p>
        </div>
      </div>
    </div>
    <div class="uploadImages__precautions">
      <p>注意事项：</p>
      <p>1、本次上传图片的商品，如商品已有图片，则已有图片将全部清除，以本次上传的图片为准</p>
      <p>2、商品图片分主图（商品列表中显示）、图册（仅在详情中展示），主图文件名须以供方SPU编号命名。</p>
      <p>3、每个商品最多支持20张图片，图片格式仅支持JPG,JPEG,BMP,PNG格式。</p>
      <p>4、每个商品以ZIP格式压缩文件上传图片，压缩文件以供方SPU编号命名。例如供方SPU编号为IRC-001，则对应图片压缩文件名应为：IRC-001.zip。</p>
      <p>5、单一商品图片如果超过20张，超过部分系统会自动清除。</p>
      <p>6、单张图片不得大于4M，大于4M上传后，不会显示该图片。</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      percentage: undefined,
      processImages: [
        { src: require('@assets/recommend-image.png'), title: '图片名称是商品编码时即为首图' },
        { src: require('@assets/recommend-image.png'), title: '其他图片随机排序显示' },
        { src: require('@assets/recommend-image.png') }
      ]
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
.uploadImages {
  &__detail {
    margin: 20px 0;
    &-left {
      width: 40%;
      border: 1px dashed #dcdfe6;
      height: 80px;
    }
    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
      height: 70px;
    }
    &-progress {
      width: 90%;
    }
  }
  &__process {
    p:first-child {
      font-size: 18px;
    }
    .center {
      text-align: center;
      margin-left: 50px;
    }
    &-img {
      margin-top: 20px;
      img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        margin-right: 20px;
      }
    }
  }
  &__precautions {
    p:first-child {
      margin-top: 30px;
    }
    p {
      margin-top: 10px;
    }
  }
  /deep/.el-progress__text {
    display: none;
  }
}
</style>
