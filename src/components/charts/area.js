/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-26 16:43:05 
 * @Last Modified time:   2017-11-26 16:43:05 
 * @Description: 面积图
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import getLinearGradient from '../tool/getLinearGradient'
import '../style/line.css'
export default class Area {
  /**
   *  默认配置项
   */
  defaultSet() {
    return {
      width: '100%',
      height: '100%',
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },
      itemStyle: {
        normal: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 100,
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
      },
      xAxis: {
        color: '#62a4f6',
        fontSize: 14,
        anchor: 'middle',
        mtop: 20 //顶部偏移量
      },
      yAxis: {
        color: '#c3e2ff',
        fontSize: 16,
        mleft: 80 //右侧偏移量
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
    this.chartName = 'l-area-chart'
    const {
      width,
      height,
      itemStyle: {
        normal
      }
    } = this.config
    this.size = getSize(selector, width, height)
    const [w, h] = this.size

    this.svg = getContainer(selector, this.chartName, 'svg').attr({
      'width': w,
      'height': h
    })
    // 创建面积图的线性渐变
    const normalGradient = getLinearGradient(normal)
    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')
    defs.html(`${defs.html()}${normalGradient.dom}`)
    this.normalGradientId = normalGradient.id

    //创建蒙版
    const mask = getContainer(`.${this.chartName}-defs`, `${this.chartName}-mask`, 'mask')
    mask.attr('id',`${this.chartName}-mask`).attr('maskUnits','userSpaceOnUse')
    const maskRect = getContainer(`.${this.chartName}-mask`, `${this.chartName}-mask-rect`, 'rect')
    maskRect.attr({
      'x':0,
      'y':0,
      'fill':'white',
      'fill-opacity':1
    })

    $(`.${this.chartName}`).show().siblings().hide()

    const data = Mock.mock({
      'area|10':[{
          'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香', '园游会', '发如雪', '珊瑚海', '迷迭香', '青花瓷'],
          'value':'@natural(100,150)'
        }]
    })
    this.dataset = data.area
  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    const {
      margin: {
        top,
        right,
        bottom,
        left
      }
    } = this.config
    const [width, height] = this.size
    const maxValue = d3.max(data,(d) => { return d.value }) * 1.2

    this.xScale = d3.scale.ordinal()
      .domain(d3.range(data.length))
      .rangeRoundBands([20, width - right - left], 0.9)

  this.yScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, height - bottom - top])

  this.yAxisScale = d3.scale.linear()
  .domain([0, maxValue])
  .range([height - bottom - top,0])

    // 绘制面积图
    this.drawArea(data)
    // 绘制Y轴
    this.drawYaxis()
    // 绘制X轴
    this.drawXaxis(data)

    //面积动画--利用蒙版
  d3.select(`#${this.chartName}-mask`).select('rect')
  .attr({
    'width': 0,
    'height': height
  })
  .transition()
  .delay(500)
  .duration(3800)
  .ease('bounce')
  .attr({
    'width': width
  })
  }
  /**
   *  绘制面积图
   */
  drawArea(data) {
    const self = this
    const {
      margin: {
        bottom
      },
      itemStyle:{
        color
      }
    } = this.config
    const [width, height] = this.size
    const container = getContainer(`.${this.chartName}`, 'area-container', 'g')
    const area = getContainer('.area-container', 'area-path', 'path')

    const areaPath = d3.svg.area()
    .x((d, i) => {
      return this.xScale(i)
    })
    .y1((d, i) => {
      return this.yScale(d.value)
    })
    .y0(height - bottom)
    .interpolate('basis')

    area.attr({
      'd': areaPath(data),
      'stroke': 'none',
      'fill': `url(#${this.normalGradientId})`,
      'transform': `translate(-${this.xScale.rangeBand()},0)`,
      'mask': `url(#${this.chartName}-mask)`
    })
  }
  /**
   *  绘制柱图的Y轴
   */
  drawYaxis() {
    const {
      margin: {
        bottom,
        top,
        left
      },
      yAxis: {
        fontSize,
        color,
        mleft
      }
    } = this.config
    const [width, height] = this.size
    const yAxis = d3.svg.axis()
      .scale(this.yAxisScale)
      .orient('left')
      .ticks(5)

    const yAxisDom = getContainer(`.${this.chartName}`, 'y-axis', 'g')
    yAxisDom.attr('transform', `translate(${mleft},${top})`).call(yAxis)
    d3.select(`.${this.chartName}`).select('.y-axis').selectAll('text').style({
      'font-size': fontSize,
      'fill': color
    })
    // 添加一根竖直线
    let yAxisLine = getContainer(`.${this.chartName}`, 'y-axis-line', 'line')
    yAxisLine.attr({
      'x1': left + 40,
      'x2': left + 40,
      'y1': height - bottom,
      'y2': top,
      'stroke': '#637dff',
      'fill': 'none'
    })
  }
  /**
   *  绘制X轴
   */
  drawXaxis(data) {
    const {
      margin: {
        right,
        bottom,
        left
      },
      xAxis: {
        color,
        fontSize,
        anchor,
        mtop
      },
      yAxis: {
        mleft
      }
    } = this.config
    const [width, height] = this.size
    const xAxisDom = getContainer(`.${this.chartName}`, 'x-axis', 'g')
    const update = xAxisDom.selectAll('text').data(data)
    update.enter().append('text')
    update.exit().remove()
    xAxisDom.selectAll('text').data(data).attr({
        'x': (d, i) => {
          return this.xScale(i)
        },
        'y': height - bottom + mtop,
        'text-anchor': anchor,
        'font-size': fontSize,
        'fill': color
      })
      .text((d, i) => {
        return d.name
      })
    // 添加一根水平线
    let xAxisLine = getContainer(`.${this.chartName}`, 'x-axis-line', 'line')
    xAxisLine.attr({
      'x1': left + 40,
      'x2': width - left - right - 40,
      'y1': height - bottom,
      'y2': height - bottom,
      'stroke': '#637dff',
      'fill': 'none'
    })
  }

}