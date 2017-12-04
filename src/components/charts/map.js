/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-12-04 10:03:04 
 * @Last Modified time:   2017-12-04 10:03:04 
 * @Description: 绘制地图
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import tooltip from '../tool/tooltip'
import chinaGeo from '../lib/chinageo.json'
import southChinaSea from '../tool/southChinaSea'
import getLinearGradient from '../tool/getLinearGradient'
export default class Map {
  /**
   *  默认配置项
   */
  defaultSet() {
    return {
      width: '100%',
      height: '100%',
      itemStyle: {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0,
        colorStops: [{
            offset: 0,
            color: 'red',
            opacity: 0.8
          },
          {
            offset: 100,
            color: 'blue',
            opacity: 0.8
          }
        ]
      }
    }
  }
  /**
   *  初始化，创建容器
   */
  constructor(selector, option) {
    const self = this
    const defaultSet = this.defaultSet()
    this.config = Object.assign(defaultSet, option)
    this.chartName = 'l-map-chart'
    const {
      width,
      height,
      itemStyle
    } = this.config
    this.size = getSize(selector, width, height)
    const [w, h] = this.size

    this.svg = getContainer(selector, this.chartName, 'svg').attr({
      'width': w,
      'height': h
    })

    $(`.${this.chartName}`).show().siblings().hide()

    // 创建线性渐变
    const gradient = getLinearGradient(itemStyle)
    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')
    defs.html(`${defs.html()}${gradient.dom}`)
    this.gradientId = gradient.id

    southChinaSea(this.svg)

    const data = Mock.mock({
      'map|34': [{
        'name|+1': ['甘肃', '青海', '广西', '贵州', '重庆', '北京', '福建', '安徽', '广东', '西藏', '新疆', '海南', '宁夏', '陕西', '山西', '湖北', '湖南', '四川', '云南', '河北', '河南', '辽宁', '山东', '天津', '江西', '江苏', '上海', '浙江', '吉林', '内蒙古', '黑龙江', '香港', '澳门', '台湾'],
        'value': '@natural(1,1000)'
      }]
    })
    this.dataset = data.map

  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    const self = this
    const {
      itemStyle: {
        colorStops
      }
    } = this.config
    const values = []
    data.map((d, i) => {
      let name = d.name
      let value = d.value
      values[name] = value
    })
    const [w, h] = this.size

    const minValue = 0
    const maxValue = d3.max(data, (d) => {
      return d.value
    })
    const linear = d3.scale.linear()
      .domain([minValue, maxValue])
      .range([0, 1])
    // 绘制图例
    const colorLegend = getContainer(`.${this.chartName}`, 'color-legend', 'g')
    const colorRect = getContainer('.color-legend', 'color-rect', 'rect')
    colorRect.attr({
      'x': 40,
      'y': h - 70,
      'width': 200,
      'height': 40,
      'fill': `url(#${this.gradientId})`,
      'stroke': 'none'
    })

    const colorMinText = getContainer('.color-legend', 'color-text-min', 'text')
    colorMinText.attr({
        'x': 40,
        'y': h - 70,
        'fill': '#fff',
        'dy': '-0.3em',
        'text-anchor': 'middle',
        'stroke': 'none'
      })
      .text(minValue)

    const colorMaxText = getContainer('.color-legend', 'color-text-max', 'text')
    colorMaxText.attr({
        'x': 240,
        'y': h - 70,
        'fill': '#fff',
        'dy': '-0.3em',
        'text-anchor': 'middle',
        'stroke': 'none'
      })
      .text(maxValue)

    const computerColor = d3.interpolate(colorStops[0].color, colorStops[1].color)

    const projection = d3.geo.mercator()
      .center([107, 31])
      .scale(650)
      .translate([w / 2, h / 2 + 100])

    const path = d3.geo.path()
      .projection(projection);

    const groups = getContainer(`.${this.chartName}`, 'province-container', 'g')
    const update = groups.selectAll("path")
      .data(chinaGeo.features)

    update.enter().append('path')
    update.exit().remove()

    const province = groups.selectAll("path").attr({
      'class': 'province',
      'fill': (d, i) => {
        return computerColor(linear(values[d.properties.name]))
      },
      'd': path
    })

    province.on('mouseover', function (d) {
        const event = d3.event
        const top = d3.event.pageY
        const left = d3.event.pageX + 20
        const option = {
          location: {
            x: left,
            y: top
          },
          data: [{
            name: d.properties.name,
            value: values[d.properties.name]
          }]
        }
        self.tooltip = tooltip(option)
        self.tooltip.show()
      })
      .on('mouseout', function () {
        self.tooltip.hide()
      })
  }
}