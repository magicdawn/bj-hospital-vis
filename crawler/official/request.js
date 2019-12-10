const {extend} = require('umi-request')

const request = extend({
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  },
})

/**
 * umi-request 特点
 *
 * request.<method>(url, options), 都是这样
 *
 * response = {data, headers, status, statusText}
 * getResponse = false, 返回 data, 默认 false
 *
 */

module.exports = request
