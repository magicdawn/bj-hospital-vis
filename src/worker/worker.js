/* global importScripts */
/* global Comlink */
/* global turf */
importScripts('https://cdn.jsdelivr.net/npm/comlink/dist/umd/comlink.js')
importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@5.1.6/turf.min.js')

/**
 * filterHospitalList
 * 耗时操作, 使用 WebWorker
 */

function filterHospitalList({list, currentPolygon}) {
  list = list.filter(item => {
    const {lng, lat} = item
    const p = [lng, lat]
    const inPolygon = turf.booleanPointInPolygon(p, currentPolygon)
    return inPolygon
  })
  return list
}

Comlink.expose({
  filterHospitalList,
})
