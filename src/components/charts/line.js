/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-26 16:43:05 
 * @Last Modified time:   2017-11-26 16:43:05 
 * @Description: 折线图
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import tooltip from '../tool/tooltip'
import '../style/line.css'
export default class Line {
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
        color:['#d7b723', '#17f3d1', '#a455f4']
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
    const defaultSet = this.defaultSet()
    this.config = Object.assign(defaultSet, option)
    this.chartName = 'l-line-chart'
    const {
      width,
      height
    } = this.config
    this.size = getSize(selector, width, height)
    const [w, h] = this.size

    this.svg = getContainer(selector, this.chartName, 'svg').attr({
      'width': w,
      'height': h
    })
    $(`.${this.chartName}`).show().siblings('svg').hide()
    this.linePath = d3.svg.line()
    .x((d, i) => {
      return this.xScale(i)
    })
    .y(d => {
      return this.yScale(d.value)
    })
    .interpolate('basis')

    const data = Mock.mock({
      'line':{
        'line1|10': [{
          'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香', '园游会', '发如雪', '珊瑚海', '迷迭香', '青花瓷'],
          'value':'@natural(100,150)'
        }],
        'line2|10': [{
          'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香', '园游会', '发如雪', '珊瑚海', '迷迭香', '青花瓷'],
          'value':'@natural(100,180)'
        }],
        'line3|10': [{
          'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香', '园游会', '发如雪', '珊瑚海', '迷迭香', '青花瓷'],
          'value':'@natural(100,160)'
        }]
      }
    })
    this.dataset = data.line
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

    //集合所有数据寻找最大value值
  let allData = []
  d3.range(3).map((d, i) => {
    allData.push(data['line' + (i + 1)])
  })

  let maxValue = allData[0][0].value

  allData.map((item, i) => {
    item.map((tip, index) => {
      maxValue = allData[i][index].value > maxValue ? allData[i][index].value : maxValue
    })
  })

    this.xScale = d3.scale.ordinal()
      .domain(d3.range(allData[0].length))
      .rangeRoundBands([20, width - right - left], 0.9)

  this.yScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, height - bottom - top])

  this.yAxisScale = d3.scale.linear()
  .domain([0, maxValue])
  .range([height - bottom - top,0])

    // 绘制折线
    this.drawLine(allData)
    // 绘制Y轴
    this.drawYaxis()
    // 绘制X轴
    this.drawXaxis(allData)
  }
  /**
   *  绘制柱子
   */
  drawLine(data) {
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
    const container = getContainer(`.${this.chartName}`, 'line-container', 'g')
    const update = container.selectAll('.l-line').data(data)
    const enter = update.enter().append('path').attr('class', 'l-line')
    update.exit().remove()

   container.selectAll('.l-line')
    .classed('active-line', false)
    .attr({
        'd': (d, i) => {
          return this.linePath(d)
        },
        'fill': 'none',
        'stroke-width': 3,
        'stroke': (d, i) => {
          return color[i]
        },
        'stroke-opacity': .6,
        'stroke-opacity': 0
      })
      .transition()
      .delay(1000)
      .attr('stroke-opacity', 1)
      .attr('class', 'active-line l-line')
    // item.on('mouseover', function (d) {
    //     d3.select(this).select('rect').attr({
    //       'fill': `url(#${self.emphasizeGradientId})`
    //     })
    //     const event = d3.event
    //     const top = d3.event.pageY
    //     const left = d3.event.pageX + 20
    //     const option = {
    //       location: {
    //         x: left,
    //         y: top
    //       },
    //       data: [{
    //         name: '当前值',
    //         value: d.value
    //       }]
    //     }
    //     self.tooltip = tooltip(option)
    //     self.tooltip.show()
    //   })
    //   .on('mouseout', function () {
    //     d3.select(this).select('rect')
    //       .attr({
    //         'fill': `url(#${self.normalGradientId})`,
    //       })
    //     self.tooltip.hide()
    //   })
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
    const update = xAxisDom.selectAll('text').data(data[0])
    update.enter().append('text')
    update.exit().remove()
    xAxisDom.selectAll('text').data(data[0]).attr({
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