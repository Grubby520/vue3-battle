<template>
  <div class="uploadImage">
    <!-- 上传图片 -->
    <el-upload
      action="http://srm-storage-test.oss-cn-shanghai.aliyuncs.com"
      ref="uploader"
      :disabled="disabled"
      list-type="picture-card"
      :limit="200"
      accept="image/png, image/jpeg, image/jpg, image/bmp"
      :file-list="fileList"
      :http-request="uploadFile"
      :on-exceed="handleExceed"
      :on-change="onChange"
      :before-upload="beforeUpload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <!-- 图片图标 -- 展示图片 -->
      <template slot="file" slot-scope="{file}">
        <div class="container">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
          <span class="container-item-actions">
            <span class="item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
            <span v-if="!disabled" class="item-delete" @click="handleRemove(file, fileList)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <div class="container-freedom">
          <slot name="content" :file="file"></slot>
        </div>
      </template>
    </el-upload>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import CommonApi from '@api/api'
import { put } from '@shared/http'
import { downloadFile } from '@/shared/util'
import { fileToMd5 } from '@shared/util'
console.log('fileToMd5', fileToMd5)
export default {
  name: 'SlUploadImages',
  model: {
    event: 'changeUploadImages'
  },
  props: {
    // 需要回显图片数组
    imageUrls: { type: Array, required: false, default: () => { return [] } },
    // 0为商品图片 1为尺寸图片
    imageType: { type: Number, required: false, default: undefined },
    disabled: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [], // 上传图片列表
      uploadImages: [] // 预上传图片地址和上传的file
    }
  },
  watch: {
    // 监听回显图片
    'imageUrls': {
      handler (newValue) {
        this.fileList = newValue
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    async beforeUpload (file) {
      // 上传支持的大小
      const LIMITM = file.size / 1024 / 1024 <= 4
      // 上传支持的格式
      const TYPE = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']
      const LIMITIMAGE = TYPE.includes(file.type)
      // 图片宽高比
      const LIMITSIZE = await this.limitSizes(file)
      if (!LIMITM) {
        this.$message.error('上传图片大小不能超过 4MB!')
        this.cancelUpload(file)
      } else if (!LIMITIMAGE) {
        this.$message.error('上传图片格式不正确!')
        this.cancelUpload(file)
      } else if (!LIMITSIZE) {
        this.$message.error('请上传1:1或者4:3,宽高值最大尺寸为4096px-4096px的图片!')
        this.cancelUpload(file)
      }
    },
    limitSizes (file) {
      return new Promise((resolve, reject) => {
        const READER = new FileReader()
        // 转为base64url
        READER.readAsDataURL(file)
        READER.onload = (event) => {
          var image = new Image()
          image.src = event.target.result
          image.onload = function () {
            const WIDTH = image.width
            const HEIGHT = image.height
            switch (WIDTH < 4096 && HEIGHT < 4096) {
              case WIDTH / HEIGHT === 1:
                resolve(true)
                break
              case WIDTH / HEIGHT === 4 / 3:
                resolve(true)
                break
              default:
                resolve(false)
            }
          }
        }
      })
    },
    handleExceed () {
      this.$message.error(`上传图片不能超过20张!`)
    },
    onChange (file, fileList) {
      // 上传的图片列表中包含本次上传的图片就放弃上传
      if (this.fileList.some(item => item.name === file.name)) {
        // 取消上传
        this.$refs.uploader.abort(file)
        // 删除钩子列表中数据
        fileList.splice(fileList.indexOf(file), 1)
        this.$message.error('不能上传相同的图片!')
      } else {
        this.fileList.push(file)
      }
    },
    handleRemove (file) {
      this.$confirm('确实要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelUpload(file)
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      // 下载oss和本地图片下载到本地
      downloadFile(file.url, file.name)
    },
    uploadFile (file) {
      const PARAMS = { 'itemNo': 'aliyun', 'fileName': file.file.name, 'contentType': file.file.type, 'imageType': this.imageType }
      // 获取预上传oss地址
      CommonApi.getOssUrl(PARAMS)
        .then(res => {
          res.data.file = file.file
          fileToMd5(file.file).then((md5) => {
            const IMAGES = this.imageUrls.filter(img => img.id)
            res.data.hash = md5
            IMAGES.push(res.data)
            console.log('IMAGES', IMAGES)
            this.$emit('changeUploadImages', IMAGES)
            this.uploadImages.push(res.data)
          })
        })
    },
    gotoOss (images) {
      this.uploadImages.forEach(pre => {
        // 根据预上传oss地址上传图片到oss上 , Content-Type：如image/png 图片格式
        put(pre.preUploadUrl, pre.file, { headers: { 'Content-Type': pre.contentType } })
          .then(res => {
          })
      })
    },
    cancelUpload (file) {
      // 取消上传文件
      this.$refs.uploader.abort(file)
      // 上传列表中删除取消文件
      this.fileList.splice(this.fileList.indexOf(file), 1)
    }
  }

}
</script>
<style scoped lang="scss">
.uploadImage {
  /deep/.el-upload-list--picture-card .el-upload-list__item {
    width: 110px;
    height: unset;
    border: 0;
    outline-color: transparent; // 去掉点击图片黑色边框问题
  }
  /deep/.el-upload--picture-card {
    width: 110px;
    height: 110px;
  }
  /deep/.el-upload--picture-card {
    line-height: 110px;
  }
  .container {
    border: 1px solid #c0ccda;
    position: relative;
    border-radius: 0.3rem;
    height: 110px;
    width: 110px;
    box-sizing: border-box;
    &-item-actions {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #ffffff;
      visibility: hidden;
      transition: all 0.3s;
    }
    &:hover {
      .container-item-actions {
        visibility: visible;
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
    &-freedom {
      margin: 10px 0 !important;
    }
    &:hover {
      .container-freedom {
        visibility: visible;
        background-color: unset;
      }
    }
  }
}
</style>
