const fs = require('fs')
const cheerio = require('cheerio')
const NextPage = require('next-page-kit')
const pmap = require('promise.map')
const pretry = require('promise.retry')
const ms = require('ms')
const _ = require('lodash')
const request = require('./request')

const startUrl = 'http://ybj.beijing.gov.cn/ddyy/ddyy/list?search_LIKE_yymc=&page=1&sortType='

const getHtml = (url, options) => request.get(url, {...options, responseType: 'text'})
const tryGetHtml = pretry(getHtml, {
  timeout: ms('10s'),
  times: 5,
})

// 获取详情
async function getDetail(code) {
  const html = await tryGetHtml('http://ybj.beijing.gov.cn/ddyy/ddyy/findByName', {
    params: {id: code},
  })
  const $ = cheerio.load(html)

  const [name, code2, district, category, rank, address, postcode, desc] = $('tbody tr')
    .toArray()
    .map(tr => {
      return $(tr)
        .find('td')
        .eq(0) // <tr><th></th><td></td></tr>
        .text()
        .trim()
    })

  return {name, code, district, category, rank, address, postcode, desc}
}

async function getPageItem(page) {
  const url = startUrl.replace(/page=1/, `page=${page}`)
  const html = await tryGetHtml(url)
  const $ = cheerio.load(html)
  const rows = $('.list tbody tr')
    .toArray()
    .map(tr => {
      const [code, name, district, category, rank] = $(tr)
        .find('td')
        .map((_, el) =>
          $(el)
            .text()
            .trim()
        )
        .toArray()
      return {code, name, district, category, rank}
    })
  return rows
}

async function getItems(limit) {
  const maxPagenum = 197
  // const maxPagenum = 2
  let arr = new Array(maxPagenum)
  arr = await pmap(
    arr,
    (_, index) => {
      const page = index + 1
      return getPageItem(page)
    },
    50
  )
  const items = _.flatten(arr)
  return items
}

const write = ({file, content}) => {
  fs.writeFileSync(file, content)
}

async function main() {
  const items = await getItems()
  const detailItems = await pmap(
    items,
    item => {
      return getDetail(item.code)
    },
    100
  )

  write({file: __dirname + '/../../data/hospital.json', content: JSON.stringify(detailItems)})
}

main()
