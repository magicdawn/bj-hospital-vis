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
  let lng
  let lat
  if (location) {
    ;[lng, lat] = location
      .split(',')
      .filter(Boolean)
      .map(s => s && s.trim())
      .map(s => Number(s))
  }
  return {lng, lat, amapGeoResponse: JSON.stringify(json)}
}

if (module === process.mainModule) {
  // exports.geo('北京市大兴区亦庄镇经海二路2号').then(console.log)
}
