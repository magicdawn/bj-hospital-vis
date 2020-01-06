const _ = require('lodash')

exports.getHospitalName = name => {
  const sourceChars = ['、', '（', '）']
  const targetChar = ','

  for (let c of sourceChars) {
    name = name.replace(new RegExp(c, 'ig'), targetChar)
  }

  const arr = name
    .split(',')
    .map(_.trim)
    .filter(Boolean)
  return arr
}
