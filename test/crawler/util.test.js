const util = require('../../crawler/util.js')

describe('crawler util', function() {
  it('getHospitalName', () => {
    const {getHospitalName} = util
    let name, result

    name = '北京大学第三医院、北京大学第三临床医学院'
    result = getHospitalName(name)
    result.includes('北京大学第三医院').should.ok()
    result.includes('北京大学第三临床医学院').should.ok()

    name =
      '北京市中关村医院（中国科学院中关村医院）、北京市海淀区老年康复医院、海淀区中关村社区卫生服务中心'
    result = getHospitalName(name)
    result.includes('北京市中关村医院').should.ok()
    result.includes('中国科学院中关村医院').should.ok()
    result.includes('北京市海淀区老年康复医院').should.ok()

    name =
      '北京市海淀区妇幼保健院（北京市海淀区妇幼保健计划生育服务中心、北京市海淀区海淀社区卫生服务中心）'
    result = getHospitalName(name)
    result.includes('北京市海淀区妇幼保健院').should.ok()
    result.includes('北京市海淀区妇幼保健计划生育服务中心').should.ok()
    result.includes('北京市海淀区海淀社区卫生服务中心').should.ok()
  })
})
