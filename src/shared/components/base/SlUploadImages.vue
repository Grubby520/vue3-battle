<template>
  <div class="uploadImage">
    <!-- 上传图片 -->
    <el-upload
      action="#"
      ref="uploader"
      :disabled="disabled"
      list-type="picture-card"
      :accept="accept"
      :file-list="fileList"
      :limit="limit"
      :http-request="uploadFile"
      :on-exceed="handleExceed"
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
export default {
  name: 'SlUploadImages',
  model: {
    prop: 'images',
    event: 'changeUploadImages'
  },
  props: {
    images: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    // 需要回显图片数组
    imageUrls: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    // 0为商品图片 1为尺寸图片
    imageType: {
      type: Number,
      required: false,
      default: undefined
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // 当图片类型为产品图片、尺码图片时需传入产品spu编码，当图片类型为资质图片需传入供应商营业执照编号
    folder: {
      type: String,
      required: false,
      default: ''
    },
    limit: {
      type: Number,
      required: false,
      default: 100
    },
    accept: {
      type: String,
      required: false,
      default: 'image/png, image/jpeg, image/jpg, image/bmp'
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: this.images, // 上传图片列表
      ossImages: []
    }
  },

  watch: {
    // 监听回显图片
    'images': {
      handler (newValue) {
        this.fileList = newValue
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    beforeUpload (file) {
      return new Promise(async (resolve, reject) => {
        // 上传支持的大小
        const LIMITM = file.size / 1024 / 1024 <= 4
        // 图片宽高比
        const LIMITSIZE = await this.limitSizes(file)
        if (!LIMITM) {
          reject(new Error(this.$message.error('上传图片大小不能超过 4MB!')))
        } else if (this.accept.indexOf(file.type) === -1) {
          reject(new Error(this.$message.error('上传图片格式不正确!')))
        } else if (!LIMITSIZE) {
          reject(new Error(this.$message.error('请上传1:1或者4:3,宽高值最大尺寸为4096px-4096px的图片!')))
        } else if (this.fileList.some(item => item.name === file.name)) {
          reject(new Error(this.$message.error('不能上传相同的图片!')))
        } else {
          resolve(true)
        }
      })
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
      this.$message.error(`上传图片不能超过${this.limit}张!`)
    },

    handleRemove (file) {
      this.$confirm('确实要删除该图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 取消上传文件
        this.$refs.uploader.abort(file)
        // 上传列表中删除取消文件
        this.fileList.splice(this.fileList.indexOf(file), 1)
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
      const PARAMS = { 'folder': this.folder, 'fileName': file.file.name, 'contentType': file.file.type, 'fileType': this.imageType }

      // 获取预上传oss地址
      CommonApi.generatePreUploadUrl(PARAMS)
        .then(res => {
          console.log(res.data)
          res.data.file = file.file
          fileToMd5(file.file).then((md5) => {
            res.data.uid = file.file.uid
            res.data.src = res.data.showUrl
            res.data.url = res.data.showUrl
            res.data.hash = md5
            res.data.name = file.file.name
            res.data.imageType = this.imageType
            this.ossImages.push(res.data)
            console.log(res.data)
            this.gotoOss(res.data.preUploadUrl, file.file)
          })
        })
    },
    gotoOss (preUploadUrl, file) {
      // 根据预上传oss地址上传图片到oss上 , Content-Type：如image/png 图片格式
      put(preUploadUrl, file, { headers: { 'Content-Type': file.type } })
        .then(res => {
          const IMAGES = this.images.filter(img => img.id)
          this.$emit('changeUploadImages', IMAGES)
          IMAGES.push(...this.ossImages)
        })
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
  /deep/ .el-upload-list__item {
    transition: none !important; // 取消动画效果
  }
  /deep/.el-upload-list__item.is-ready {
    display: none; // 图片闪烁问题
  }
  .container {
    border: 1px solid #c0ccda;
    position: relative;
    border-radius: 0.3rem;
    height: 110px;
    width: 110px;
    box-sizing: border-box;
    &-item-actions {
      // 图标设置
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
      object-fit: contain;
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
