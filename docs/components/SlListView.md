### 页面布局

```vue
<SlListView 
 @goto-page="gotoPage"  
 @reset="reset" 
 :total="page.total"
 :pageIndex="page.pageIndex"
 ref="listView"
>
 <div slot="search" ></div>
</SlListView>

Data：
 page: {
   pageIndex: 1,
   total: 0
 },
Info：{}

Methods：
  gotoPage(pageSize = 10, pageIndex = 1) {
    HTTP.get('products/product-variant-offline-plan', {
      params: this.info
    })
    .then((res) => {
     this.page.total = res.total //更新total
    })
  },

```



#### Table Attributes

| 参数         | 说明             | 类型   | 可选值     | 默认值 |
| ------------ | ---------------- | ------ | ---------- | ------ |
| isPagination | 是否显示分页     | bolean | true/false | true   |
| isRest       | 是否显示重置按钮 | bolean | true/false | true   |
| total        | 更新列表总数     | number | —          | —      |
| pageIndex    | 列表页码         | number | —          | 1      |



#### Table Events

| 事件名   | 说明             | 参数                          |
| -------- | ---------------- | ----------------------------- |
| reset    | 重置             | 重置页面中的条件              |
| gotoPage | 调用接口更新数据 | pageSize，pageIndex           |
| refresh  | 单独刷新列表     | this.$refs.listView.refresh() |



#### Table Slot

| name   | 说明                           | 参数 |
| ------ | ------------------------------ | ---- |
| search | 搜索区域（搜索按钮和重置按钮） | —    |
