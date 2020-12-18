### **详情**
```vue
< SlDetails
  ref="control"
  :references="$refs"
  form="form"
  :mode="mode"
  :create="create"
  :load="load"
  :modify="modify"
  :isRight="true"
  :cancel ="cancel "
  saveText="确定"
  cancelText="取消"
/>

```



#### Table Attributes

| 参数       | 说明                 | 类型    | 可选值                                     | 默认值 |
| ---------- | -------------------- | ------- | ------------------------------------------ | ------ |
| references | 表单名称集合         | string  | —                                          | —      |
| form       | 表单名称             | string  | —                                          | —      |
| mode       | 页面状态             | string  | View（查看）/create（创建）/modify（编辑） | —      |
| isRight    | 确认按钮是否右侧显示 | boolean | true/false                                 | false  |
| saveText   | 确认按钮显示内容     | string  | —                                          | —      |
| cancelText | 取消按钮显示内容     | string  | —                                          | —      |



#### Table Events

| 事件名 | 说明                                              |
| ------ | ------------------------------------------------- |
| create | 添加  当前mode为create可以调用                    |
| modify | 编辑  当前mode为modify可以调用                    |
| load   | 加载 （回显调用）  mode 为 view或者modify可以调用 |
| cancel | 取消按钮可调用                                    |
