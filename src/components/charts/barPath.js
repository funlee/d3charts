/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 22:35:50 
 * @Last Modified time:   2017-11-24 22:35:50 
 * @Description: 柱状图扩展--异形填充--利用Path
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import tooltip from '../tool/tooltip'
import getLinearGradient from '../tool/getLinearGradient'
export default class BarPath {
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
      itemStyle:{
        barWidth:38,//异形图案的宽度，按照设计稿是76
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
        },
        emphasize: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 100,
          colorStops: [{
              offset: 0,
              color: 'blue',
              opacity: 0.8
            },
            {
              offset: 100,
              color: 'red',
              opacity: 0.8
            }
          ]
        }
      },
      label:{
        color:'#62a4f6',
        fontSize:14,
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
    this.chartName = 'l-bar-path-chart'
    const {
      width,
      height,
      itemStyle: {
        normal,
        emphasize
      }
    } = this.config
    this.size = getSize(selector, width, height)
    const [w, h] = this.size

    this.svg = getContainer(selector, this.chartName, 'svg').attr({
      'width': w,
      'height': h
    })
    $(`.${this.chartName}`).show().siblings().hide()

    const normalGradient = getLinearGradient(normal)
    const emphasizeGradient = getLinearGradient(emphasize)
    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')
    defs.html(`${defs.html()}${normalGradient.dom}${emphasizeGradient.dom}`)
    this.normalGradientId = normalGradient.id
    this.emphasizeGradientId = emphasizeGradient.id

    const data = Mock.mock({
      'bar|6': [{
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

   //利用区域生成器绘制异形图形的path
  this.area = d3.svg.area()
    .x((d)=> {
      return d.x
    })
    .y0((d)=> {
      return height - d.y0
    })
    .y1((d)=> {
      return height - d.y1
    })

    // 绘制柱子
    this.drawBar(data)
    // 绘制Y轴
    // this.drawYaxis()
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
      itemStyle:{
        barWidth
      },
      label:{
        color,
        fontSize
      }
    } = this.config
    const [width, height] = this.size
    const container = getContainer(`.${this.chartName}`, 'bar-container', 'g')
    const update = container.selectAll('.bar').data(data)
    const enter = update.enter().append('g').attr('class', 'bar')
    enter.append('path')
    enter.append('text')
    update.exit().remove()

    const item = container.selectAll('.bar')
    item.select('path').attr({
      'transform':(d,i) => {
        return `translate(${this.xScale(i) - barWidth},-20)`//设置translateY让图形不超过X轴轴线
      },
      'fill': `url(#${this.normalGradientId})`,
      'd': (d, i) => {
        const data = [{
          x: 0,
          y0: 20,
          y1: 40
        }, {
          x: 38,
          y0: 40,
          y1: 40
        }, {
          x: 76,
          y0: 20,
          y1: 40
        }]
        return this.area(data)
      }
    })
    .transition()
    .duration(2000)
    .attr({
      'd': (d, i) => {
        const pathY = this.yScale(d.value)
        const data = [{
          x: 0,
          y0: 20,
          y1: pathY
        }, {
          x: 38,
          y0: 40,
          y1: pathY + 20
        }, {
          x: 76,
          y0: 20,
          y1: pathY
        }]
        return this.area(data)
      }
    })

    item.select('text').attr({
      'x': (d, i) => {
        return this.xScale(i)
      },
      'y': d => {
        return height - this.yScale(d.value) - 30//图案有个尖，字体过不去，所以加30px
      },
      'dy': '1em',
      'opacity': 0,
      'text-anchor':'middle',
      'fill':color,
      'font-size':fontSize
    })
    .text(d => {
      return d.value
    })

    item.on('mouseover', function() {
      d3.select(this).select('text')
        .transition()
        .duration(1000)
        .attr({
          'dy': '-2em',
          'opacity': 1
        })
      d3.select(this).select('path').attr({
        'fill': `url(#${self.emphasizeGradientId})`
      })
    })
    .on('mouseout', function() {
      d3.select(this).select('text')
        .transition()
        .duration(1000)
        .attr({
          'dy': '1em',
          'opacity': 0
        })
        d3.select(this).select('path').attr({
          'fill': `url(#${self.normalGradientId})`
        })
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