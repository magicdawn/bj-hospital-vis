import {gcj02towgs84} from 'coordtransform'

/**
 * 高德是 gcj02 坐标系
 * https://lbs.amap.com/api/javascript-api/guide/transform/convertfrom/?sug_index=0
 */

export function lnglat([lng, lat], {current} = {current: 'gcj02'}) {
  if (current === 'gcj02') {
    ;[lng, lat] = [lng, lat].map(Number)
    ;[lng, lat] = gcj02towgs84(lng, lat)
    return [lng, lat]
  }

  throw new Error('not implemented!')
}
