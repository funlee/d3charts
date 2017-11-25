/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-11-09 21:21:04
 * @Description:  柱状图扩展--正规图形填充
 *                以圆为例
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import tooltip from '../tool/tooltip'
export default class BarNormal {
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
      doteRadius: 8, //小圆点的半径
      doteMT: 4, //小圆点的margin-top
      itemStyle: {
        color:['#647260', '#f6e046']
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
    this.chartName = 'l-bar-normal-chart'
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
    const data = Mock.mock({
      'bar|10': [{
        'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香', '园游会', '发如雪', '珊瑚海', '迷迭香', '青花瓷'],
        'value':'@natural(100,1000)'
      }]
    })
    this.dataset = data.bar
  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    const {
      doteRadius,
      doteMT,
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

    const maxCircleH = height - top - bottom//柱子最大高度
    this.maxCircleNum = Math.ceil((maxCircleH + doteMT) / (2 * doteRadius + doteMT))
    // 根据数据值和最大值的比例关系，确定该数据应该绘制几个圆圈-------比例尺
    this.circleNumScale = d3.scale.linear()
      .domain([0, maxValue])
      .range([0, this.maxCircleNum])

    // 绘制柱子
    this.drawBar(data)
    // 绘制Y轴
    this.drawYaxis()
    // 绘制X轴
    this.drawXaxis(data)
  }
  /**
   *  绘制柱子
   */
  drawBar(data) {
    const self = this
    const {
      margin: {
        bottom
      },
      doteRadius,
      doteMT,
      itemStyle: {
        color
      },
    } = this.config
    const [width, height] = this.size
    const container = getContainer(`.${this.chartName}`, 'bar-container', 'g')
    const update = container.selectAll('.bar').data(data)
    const enter = update.enter().append('g').attr({
      'class': 'bar',
      'cursor': 'pointer'
    })
    update.exit().remove()

    const item = container.selectAll('.bar').attr({
      'transform': (d, i) => {
        return `translate(${this.xScale(i)},0)`
      }
    })

    const circleUpdate = item.selectAll('circle').data((d) => {
      return d3.range(parseInt(this.circleNumScale(d.value).toFixed(0), 10))
    })
    circleUpdate.enter().append('circle')
    circleUpdate.exit().remove()
    item.selectAll('circle').attr({
      'cy': (d, i) => { 
        return height - bottom
      },
      'stroke': 'none',
      'fill': (d, i) => {
        const a = color[0]
        const b = color[1]
        const compute = d3.interpolate(a, b)
        return compute(d / self.maxCircleNum)
      },
      'r': doteRadius
    })
    .transition()
    .duration(2000)
    .attr({
      'cy': (d, i) => { 
        return height - bottom - (doteRadius + d * (2 * doteRadius + doteMT))
      },
    })
    item.on('mouseover', function (d) {
        d3.select(this).selectAll('circle').attr({
          'fill': (d, i) => {
            const a = color[0]
            const b = color[1]
            const compute = d3.interpolate(a, b)
            return compute(1 - (d / self.maxCircleNum))
          },
        })
        const event = d3.event
        const top = d3.event.pageY
        const left = d3.event.pageX + 20
        const option = {
          location: {
            x: left,
            y: top
          },
          data: [{
            name: '数值',
            value: d.value
          }]
        }
        self.tooltip = tooltip(option)
        self.tooltip.show()
      })
      .on('mouseout', function () {
        d3.select(this).selectAll('circle').attr({
          'fill': (d, i) => {
            const a = color[0]
            const b = color[1]
            const compute = d3.interpolate(a, b)
            return compute(d / self.maxCircleNum)
          },
        })
        self.tooltip.hide()
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