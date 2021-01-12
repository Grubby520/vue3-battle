<template>
  <div>
    <UploadZip class="upload-zip__component" @statusChange="statusChange"></UploadZip>

    <div class="block-margin-top upload-zip__notice">
      <h4>如何创建图片压缩包</h4>
      <br />
      <div class="flex-left">
        <div class="align-center">
          <svg class="icon icon-sl-wenjianjia" aria-hidden="true">
            <use xlink:href="#icon-sl-wenjianjia" />
          </svg>
          <p class="file-example">P123456</p>
          <p>文件夹以商品编码命名</p>
        </div>
        <span class="arrow-right margin-l-r-20"></span>
        <div class="align-center">
          <svg class="icon icon-sl-yasuobao" aria-hidden="true">
            <use xlink:href="#icon-sl-yasuobao" />
          </svg>
          <p class="file-example">P123456</p>
          <p>压缩包以商品编码命名</p>
        </div>
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="block-margin-top upload-zip__attention">
      <p class="attention-title">注意事项：</p>
      <p>1、本次上传图片的商品，如商品已有图片，则已有图片将全部清除，以本次上传的图片为准</p>
      <p>2、每个商品最多支持20张图片，图片格式仅支持JPG,JPEG,BMP,PNG格式。</p>
      <p>3、每个商品以ZIP格式压缩文件上传图片，压缩文件以供方SPU编号命名。例如供方SPU编号为IRC-001，则对应图片压缩文件名应为：IRC-001.zip。</p>
      <p>4、单一商品图片如果超过20张，超过部分系统会自动清除。</p>
      <p>5、单张图片不得大于4M，大于4M上传后，不会显示该图片。</p>
      <p>6、同时最多上传20个压缩包。</p>
      <p>7、每个压缩包ZIP只能有一个文件夹,如果一个压缩包内有多个文件夹，系统将只导入与压缩文件命名一致的文件夹，以其他文件夹命名的文件，系统不进行导入。</p>
    </div>
  </div>
</template>

<script>
import UploadZip from '@/views/components/ImportProductImgs/UploadZip.vue'

export default {
  name: 'ImportProductImgs',
  components: {
    UploadZip
  },
  data: function () {
    return {
      uploadStatus: 'done'
    }
  },
  methods: {
    statusChange (val) {
      this.uploadStatus = val
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.uploadStatus !== 'done') {
      this.$message({
        type: 'error',
        message: '有文件正在上传中，不能离开当前页面，请等待...',
        duration: 5000
      })
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.block-margin-top {
  margin-top: 5rem;
}

p {
  line-height: 1.5;
}

.upload-zip_component {
  width: 100%;
}

.upload-zip__detail {
  .progress-container {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 2rem 1.4rem;
    margin-right: 1.4rem;
    margin-bottom: 1.4rem;
  }
  .progress-explain {
    min-width: 10rem;
  }
}

.upload-zip__notice {
  .icon-sl-wenjianjia,
  .icon-sl-yasuobao {
    width: 4em;
    height: 4em;
  }

  .arrow-right {
    display: inline-block;
    width: 5rem;
    height: 0.2rem;
    border: 0;
    background: #c0c4cc;
    position: relative;
    &::before,
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      content: '';
      display: inline-block;
      width: 0.8rem;
      height: 0.2rem;
      background: #c0c4cc;
    }
    &::before {
      transform: rotate(45deg);
      transform-origin: 100% 0;
    }
    &::after {
      transform: rotate(315deg);
      transform-origin: 100% 0.2rem;
    }
  }
  .margin-l-r-20 {
    margin: 0 1rem;
  }

  .file-example {
    margin: 1.4rem 0 1rem 0;
  }
}

.upload-zip__attention {
  .attention-title {
    font-weight: bold;
  }

  p {
    &:not(:first-child) {
      padding-left: 2rem;
    }
  }
}
</style>
