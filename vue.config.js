const path = require('path')

function resolve (dirName) {
  return path.resolve(__dirname, dirName)
}
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  css: {

  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@shared', resolve('src/shared'))
      .set('@components', resolve('src/shared/components'))
      .set('@directives', resolve('src/shared/directives'))
      .set('@filters', resolve('src/shared/filters'))
      .set('@mixins', resolve('src/shared/mixins'))
      .set('@plugins', resolve('src/shared/plugins'))
      .set('@assets', resolve('src/assets'))
      .set('@api', resolve('src/api'))

    if (process.env.config_report) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }
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
