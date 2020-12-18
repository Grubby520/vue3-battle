### **分页**

```vue
<SlBasePagination
 :total="total" 
 @pageChange="pageChange"
 :pageIndex="pageIndex"
/>

Data：
pageIndex: 1, // 页数
total: 0, // 总页数
pageSize: 10,
info:{}

methods：
 pageChange(item) {
      this.pageIndex = item.pageIndex
      this.pageSize = item.pageSize
      this.gotoPage() // 改变页码，重新渲染页面
 }，
 gotoPage() { // 当前组件方法
      this.info.pageIndex = this.pageIndex
      this.info.pageSize = this.pageSize
      HTTP.get('products/product-variant-offline-plan', {
          params: this.info
       })
       .then((res) => {
          const { total } = res.data
          this.total = total
       })
}
```



#### Table Attributes

| 参数      | 说明 | 类型   | 可选值 | 默认值 |
| --------- | ---- | ------ | ------ | ------ |
| total     | 总数 | number | —      | —      |
| pageIndex | 页码 | number | —      | 1      |



#### Table Events

| 事件名     | 说明             |
| ---------- | ---------------- |
| pageChange | 更新页码重新赋值 |

