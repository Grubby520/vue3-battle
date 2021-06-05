### 页面布局

```vue
<SlTableInfo
        ref="table"
        :tableData="tableData"
        :columns="columns"
        v-model="selections"
        :multiple="true"
        :disabledKeys="disabledKeys"
      >
     <template #times="{row}">
          <p>创建:{{row.createTime}}</p>
          <p>更新:{{row.updateTime}}</p>
    </template>
     <template #operation="{row}" class="operate">
          <el-button @click="cancel(row)" v-if="row.status.value===1" type="text">撤回</el-button>
     </template>
</SlTableInfo>

Data：
 columns: [
        {
          name: 'times',
          label: '创建时间/更新时间',
          align: 'center'
        },
        {
          name: 'operation',
          label: '操作',
          align: 'center'
        }
      ]

```



#### Table Attributes

| 参数         | 说明                 | 类型    | 可选值     | 默认值 |
| ------------ | -------------------- | ------- | ---------- | ------ |
| tableData    | 表格数据             | array   | -          | -      |
| columns      | 表头数据             | array   | -          | -      |
| multiple     | 是否显示复选框       | boolean | false/true | false  |
| showIndex    | 是否显示索引         | boolean | false/true | false  |
| expand       | 是否下拉展示         | boolean | false/true | false  |
| disabledKeys | 复选框需要禁用的数据 | array   | -          | -      |
| rowKey       | 复选框需要禁用标识   | string  | -          | id     |
| align        | 表格对齐方式         | string  | -          | left   |
| params       | 内置图片格式设置     | object  | -          | -      |

#### Column Attributes

| 参数         | 说明                 | 类型    | 可选值                   | 默认值 |
| ------------ | -------------------- | ------- | ------------------------ | ------ |
| align        | 每列对齐方式         | string  | -                        | -      |
| width        | 每列宽度             | string  | -                        | -      |
| class-name   | 每列样式             | string  | -                        | -      |
| key          | 每列绑定值           | string  | -                        | -      |
| label        | 每列表头展示数据     | string  | -                        | -      |
| header-align | 每列表头数据对齐方式 | array   | -                        | -      |
| rowKey       | 复选框需要禁用标识   | string  | -                        | id     |
| isImage      | 列是否是图片         | boolean | false/true               | false  |
| imagesParams | 表格内置图片格式     | object  | {width: 128,height: 128} | -      |

####   Table Slot

| name      | 说明     | 参数                                      |
| --------- | -------- | ----------------------------------------- |
| header | 自定义表头数据 |  |