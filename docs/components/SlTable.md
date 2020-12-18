### **列表**

```vue
<SlTable 
:tableData="tableData" 
:columns="columns"
:selectionsDisabled ="selectionsDisabled "
:tooltip="false"
v-model="selections "
>
  <div slot="operation" slot-scope={row}>
   <span @click="pass(props)">通过</span>
   <span @click="pass()">不通过</span>
  </div>
 </SlTable>
 
Data：
columns: [
  {
     prop: 'ID', // 表格中要展示的内容
    label: '日期11', // 表头信息
    width: '300', // 设置表格宽度
    isInImg: 'imageSrc', // 表格内部要显示图片地址
    pre: {  // 需要换行数据
       productName: '平台PID',
     productVariantId: '店铺'
    }
   },
   {
     prop: 'imageSrc',
    label: '头像',
    isImg: true // 是否展示图片
   }
]

```



#### Table Attributes

| 参数               | 说明                 | 类型    | 可选值     | 默认值 |
| ------------------ | -------------------- | ------- | ---------- | ------ |
| tableData          | 列表数据             | array   | —          | —      |
| columns            | 表头信息             | array   | —          | —      |
| border             | 是否显示边框         | boolean | true/false | true   |
| selection          | 是否显示复选框       | boolean | true/false | true   |
| selections         | 选中复选框数据       | array   | —          | —      |
| operate            | 是否显示操作区域     | boolean | true/false | true   |
| tooltip            | 列表内容是否工具提示 | boolean | true/false | true   |
| selectionsDisabled | 需要置灰复选框数据   | array   | —          | —      |



####   Table Slot

| name      | 说明     | 参数                                      |
| --------- | -------- | ----------------------------------------- |
| operation | 操作区域 | 表格每行数据 :row   每行索引值：row.index |


