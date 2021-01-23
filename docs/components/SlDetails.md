#### **详情**

```vue
< SlDetails ref="control" :references="$refs" form="form" :mode="mode"
:create="create" :load="load" :modify="modify" :isRight="true" :cancel ="cancel
" saveText="确定" cancelText="取消" />
```

#### **Table Attributes**

| 参数       | 说明                       | 类型         | 可选值                                                                                                               | 默认值 |
| ---------- | -------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------- | ------ |
| references | 所有需要校验表单父组件 ref | object       | -                                                                                                                    | -      |
| form       | 需要校验表单名称           | string       | -                                                                                                                    | -      |
| mode       | 页面状态                   | string       | View（查看）/create（创建）/modify（编辑）                                                                           | -      |
| isRight    | 按钮是否右侧显示           | boolean      | true/false                                                                                                           | false  |
| saveText   | 确认按钮显示内容           | string/array | - 多个保存按钮格式：[{ 0: '保存' }, { 1: '提交' }] 组件中：this.\$refs.control.someBtnParams 区分调用的保存/提交按钮 | -      |
| cancelText | 取消按钮显示内容           | string       | -                                                                                                                    | -      |

#### **Table Events**

| 事件名 | 说明                                                    |
| ------ | ------------------------------------------------------- |
| create | 添加方法（当前 mode 为 create 可以调用）                |
| modify | 编辑方法 （当前 mode 为 modify 可以调用）               |
| load   | 加载方法 （回显调用） mode 为 view 或者 modify 可以调用 |
| cancel | 取消按钮可调用                                          |
