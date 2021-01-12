/**
 * 下载blob格式的文件
 * @param {blobData} blobData blob格式的数据源
 * @param {fileName} fileName 导出的文件名
 */
export const downloadBlobData = (blobData, fileName) => {
  downloadFile(URL.createObjectURL(blobData), fileName)
}

/**
 * 下载文件
 * @param {file} file 要下载的文件
 * @param {fileName} fileName  要下载的文件名
 */
export const downloadFile = (file, fileName) => {
  // 生成一个a标签节点
  let link = document.createElement('a')
  // 定义[a]标签属性  ---开始
  link.download = fileName
  link.href = file
  link.style.display = 'hidden'
  // 定义[a]标签属性  ---结束

  // 将[a]标签挂在到 [body]
  document.body.appendChild(link)
  // 模拟点击[a]标签
  link.click()
  // 移除[a]标签
  document.body.removeChild(link)
}
