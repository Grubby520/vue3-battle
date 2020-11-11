const path = require('path')

function resolve (dirName) {
  return path.resolve(__dirname, dirName)
}

module.exports = {
  css: {

  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@components', resolve('src/components'))
      .set('@static', resolve('src/assets'))
      .set('@shared', resolve('src/shared'))
  },
  configureWebpack: {
    plugins: []
  },
  // lintOnSave: false,
  transpileDependencies: ['vue-echarts', 'resize-detector'], // vue-cli创建的项目,使用vue-echarts时需要加如此配置
  devServer: {
    port: 8088
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8088',
    //     ws: true,
    //     secure: false,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }
}
