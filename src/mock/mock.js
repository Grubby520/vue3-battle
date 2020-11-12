var Mock = require('mockjs')
const dataSource = process.env.VUE_APP_DATASOURCE

/**
 * 获取模拟mock数据
 * @param {*} use 是否使用,默认不使用,用于实现细粒度控制
 */
export function mockGetData (use = false) {
  if (dataSource === 'mock') {
    use = true
  }

  if (process.env.NODE_ENV === 'development' && use) {
    Mock.mock(/api\/(.*)\/mock/, function (options) {
      return {
        'success': true,
        'data': {

        },
        'error': null
      }
    })
  }
}
