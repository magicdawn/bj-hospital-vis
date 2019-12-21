/* global importScripts */
/* global Comlink */
/* global turf */
importScripts('https://cdn.jsdelivr.net/npm/comlink/dist/umd/comlink.js')
importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@5.1.6/turf.min.js')

function filterHospitalList({
  // constants
  DEFAULT_AD_CODE,
  ALL,

  fulllist,
  currentRank,
  currentCategory,
  currentAdcode,
  currentPolygon,
}) {
  const start = Date.now()
  let list = fulllist

  // rank
  if (currentRank !== ALL) {
    list = list.filter(item => item.rank === currentRank)
  }

  // category
  if (currentCategory !== ALL) {
    list = list.filter(item => item.category === currentCategory)
  }

  // polygon filter
  if (currentPolygon && currentAdcode !== DEFAULT_AD_CODE) {
    list = list.filter(item => {
      const {lng, lat} = item
      const p = [lng, lat]
      const inPolygon = turf.booleanPointInPolygon(p, currentPolygon)
      return inPolygon
    })
  }

  console.log('calc for currentList ', Date.now() - start)
  return list
}

Comlink.expose({
  filterHospitalList,
})
