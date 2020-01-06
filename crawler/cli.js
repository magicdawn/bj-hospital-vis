#!/usr/bin/env node

const fs = require('fs')
const _ = require('lodash')
const yargs = require('yargs')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(require('./sequelize-options.js'))
const {Op, INTEGER, STRING, NUMBER, DATE} = Sequelize
const {geo, polygon} = require('./official/use-amap-api.js')
const {getHospitalName} = require('./util.js')
require('./dotenv')

const Hospital = sequelize.define(
  'hospital',
  {
    code: {
      type: INTEGER,
      primaryKey: true,
    },
    name: STRING,
    district: STRING,
    category: STRING,
    rank: STRING,
    address: STRING,
    postcode: STRING,
    desc: STRING,
    lng: NUMBER,
    lat: NUMBER,
    remark: STRING,
    amapGeoResponse: {
      type: STRING,
      field: 'amap_geo_response',
    },
    createdAt: {
      type: DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DATE,
      field: 'updated_at',
    },
  },
  {
    tableName: 'hospital',
  }
)

const commandToSqlite = {
  command: 'to-sqlite',
  desc: 'to sqlite',
  async handler(argv) {
    const json = require('../data/hospital.json')

    for (let row of json) {
      console.log('process', row)
      await Hospital.create(row)
    }
  },
}

const commandGeo = {
  command: 'geo',
  desc: 'use amap geo',
  async handler(argv) {
    const rows = await Hospital.findAll({
      where: {
        amapGeoResponse: {
          [Op.is]: null,
        },
        lng: {
          [Op.is]: null,
        },
        lat: {
          [Op.is]: null,
        },
      },
    })

    for (let row of rows) {
      const {code, name, address} = row.get()
      const {lng, lat, amapGeoResponse} = await geo(name)
      await Hospital.update({lng, lat, amapGeoResponse}, {where: {code}})
    }

    // 使用 name 匹配不到的
    // 继续使用 address 匹配
    {
      const rows = await Hospital.findAll({
        where: {
          amapGeoResponse: {
            [Op.not]: null,
          },
          lng: {
            [Op.is]: null,
          },
          lat: {
            [Op.is]: null,
          },
        },
      })

      for (let row of rows) {
        const {code, name, address} = row.get()
        const {lng, lat, amapGeoResponse} = await geo(address)
        await Hospital.update({lng, lat, amapGeoResponse}, {where: {code}})
        console.log('process complete (code=%s)', code)
      }
    }
  },
}

const commandGenerateJson = {
  command: 'generate-json',
  desc: '生成前端静态 json',
  async handler(argv) {
    let rows = await Hospital.findAll()
    rows = rows.map(row => {
      const keys = ['code', 'name', 'lng', 'lat', 'rank', 'category']
      const rowData = row.get()
      return keys.map(k => rowData[k])
    })

    fs.writeFileSync(__dirname + '/../public/data/hospital-with-geo.json', JSON.stringify(rows))
    console.log('[done]: file hospital-with-geo.json writed')
  },
}

const commandGetPolygon = {
  command: 'get-polygon',
  desc: 'get bj polygon',
  async handler(argv) {
    const json = await polygon()
    const arr = json.districts

    // remove ‘北京城区’
    _.remove(arr, {name: '北京城区'})

    // remove subdistricts
    for (let item of arr) {
      delete item.districts
    }

    const file = __dirname + '/../public/data/district.json'
    const content = JSON.stringify(arr)
    fs.writeFileSync(file, content, 'utf8')

    console.log('[done]: districts.json writed')
  },
}

const commandGeo20200106 = {
  command: 'geo-20200106',
  desc: '处理名称包含多个名词的医院',
  async handler(argv) {
    // 名字有多个的
    const rows = await Hospital.findAll({
      where: {
        [Op.or]: [
          {name: {[Op.like]: '%、%'}},
          {name: {[Op.like]: '%（%'}},
          {name: {[Op.like]: '%）%'}},
        ],
      },
    })

    for (let row of rows) {
      const item = row.get()
      const {code, name, address} = item
      const names = getHospitalName(name)
      let search

      // use first name
      search = names[0]
      const {lng, lat, formattedAddress, amapGeoResponse} = await geo(search)
      await Hospital.update({lng, lat, amapGeoResponse}, {where: {code}})
      console.log('processed: %O', {
        old: item,
        new: {
          lng,
          lat,
          formattedAddress,
          amapGeoResponse,
        },
      })
    }
  },
}

const argv = yargs
  .alias({
    h: 'help',
  })
  .command(commandToSqlite)
  .command(commandGeo)
  .command(commandGeo20200106)
  .command(commandGenerateJson)
  .command(commandGetPolygon)
  .demandCommand()
  .help().argv
