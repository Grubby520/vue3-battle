/**
* 确认弹窗
* @param {Object} context this上下文
* @param {String} msg 消息内容
* @param {String} title 标题
* @param {String} 类型 info、success、warning、error
*/
export function confirmBox (context, msg, title = '提示', type = 'warning') {
  return context.$confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  })
}

export function successNotify (context, msg, useHtml = false, duration = 4500) {
  context.$notify({
    title: '成功',
    message: msg,
    type: 'success',
    dangerouslyUseHTMLString: useHtml,
    duration
  })
}
export function errorNotify (context, msg, useHtml = false, duration = 4500) {
  context.$notify({
    title: '失败',
    message: msg,
    type: 'error',
    dangerouslyUseHTMLString: useHtml,
    duration
  })
}
