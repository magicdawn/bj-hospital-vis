/**
 * 地址解析
 * https://lbs.amap.com/api/webservice/guide/api/georegeo#geo
 */

const request = require('./request')
const debug = require('debug')('app:crawler:use-amap-api')
const _ = require('lodash')
require('../dotenv.js')

exports.geo = async address => {
  const json = await request.get('https://restapi.amap.com/v3/geocode/geo', {
    params: {
      key: process.env.AMAP_KEY,
      address,
      city: '北京',
    },
  })

  const location = _.get(json, 'geocodes.0.location')
  const formattedAddress = _.get(json, 'geocodes.0.formatted_address')
  let lng
  let lat
  if (location) {
    ;[lng, lat] = location
      .split(',')
      .filter(Boolean)
      .map(s => s && s.trim())
      .map(s => Number(s))
  }
  return {lng, lat, formattedAddress, amapGeoResponse: JSON.stringify(json)}
}

exports.polygon = async function() {
  const json = await request.get('https://restapi.amap.com/v3/config/district', {
    params: {
      key: process.env.AMAP_KEY,
      keywords: '010', // bj citycode
      subdistrict: 1,
      extensions: 'all',
    },
  })
  return json
}

if (module === process.mainModule) {
  // exports.geo('北京市大兴区亦庄镇经海二路2号').then(console.log)
  // exports.polygon()
  // exports.geo('北京大学第三医院').then(console.log)
  // exports.geo('中国人民解放军第三0二医院').then(console.log)
}
