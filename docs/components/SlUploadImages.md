### **上传图片**

```vue
<SlUploadImages
    v-model="images"
    :imageType="0"
    :folder="certificationNo"
    :limit="1"
    :multiple="true"
    :disabled="true "
    :tools="['download', 'delete']"
    :limits="[{type: 'size',meta: {size: 1}}]"
  >
  <div slot="content" slot-scope="{file}">
     <el-button>设为颜色主图</el-button>
  </div>
</SlUploadImages>

```



#### Table Attributes

| 参数      | 说明                                             | 类型    | 可选值                                                   | 默认值                 |
| --------- | ------------------------------------------------ | ------- | -------------------------------------------------------- | ---------------------- |
| v-model   | 上传的图片集合/回显图片数组                      | array   | —                                                        | —                      |
| imageType | 0为商品图片，1为尺寸图片，2供应商资质图片        | number  | —                                                        | —                      |
| folder    | 产品/尺码图片传spu，资质图片传营业执照号，非必填 | string  | —                                                        | —                      |
| tools     | 图片放大，下载，删除功能icon展示                 | array   | download/delete/zoom                                     | [download,delete,zoom] |
| limits    | 图片上传校验                                     | array   | size（图片的上传大小）/scale（图片缩放比）/ppi(图片宽高) | size,scale,ppi         |
| limit     | 限制上传的数量                                   | numbe   | —                                                        | 100                    |
| multiple  | 是否本地上传多张图片                             | boolean | —                                                        | false                  |
| disabled  | 限制图片的上传功能icon置灰，只显示放大功能       | boolean | —                                                        | false                  |



#### Table Slot

| name    | 说明                                 | 参数                      |
| ------- | ------------------------------------ | ------------------------- |
| content | 操作区域，上传图片下方设置自定义区域 | file 包含上传图片所有参数 |
