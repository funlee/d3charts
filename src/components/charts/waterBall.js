/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-27 13:48:55 
 * @Last Modified time:   2017-11-27 13:48:55 
 * @Description: 水球图 
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import tooltip from '../tool/tooltip'
import getLinearGradient from '../tool/getLinearGradient'
export default class WaterBall {
  /**
   *  默认配置项
   */
  defaultSet() {
    return {
      width: '100%',
      height: '100%',
      radius: 66,
      itemStyle: {
        outline: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 100,
          colorStops: [{
              offset: 0,
              color: 'rgb(6, 124, 255)',
              opacity: 0.8
            },
            {
              offset: 100,
              color: 'rgb(160, 60, 218)',
              opacity: 0.8
            }
          ]
        },
        water: {
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
      }
    }
  }
  /**
   *  初始化，创建容器
   */
  constructor(selector, option) {
    const defaultSet = this.defaultSet()
    this.config = Object.assign(defaultSet, option)
    this.chartName = 'l-waterBall-chart'
    const {
      width,
      height,
      radius,
      itemStyle: {
        outline,
        water
      }
    } = this.config
    this.size = getSize(selector, width, height)
    const [w, h] = this.size

    this.svg = getContainer(selector, this.chartName, 'svg').attr({
      'width': w,
      'height': h
    })
    $(`.${this.chartName}`).show().siblings().hide()

    // 创建外圈圆和内部水波浪的线性渐变
    const outlineGradient = getLinearGradient(outline)
    const waterGradient = getLinearGradient(water)

    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')
    defs.html(`${defs.html()}${outlineGradient.dom}${waterGradient.dom}`)

    this.outlineGradientId = outlineGradient.id
    this.waterGradientId = waterGradient.id
    const data = Mock.mock({
      'waterBall|3': [{
        'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破'],
        'value': '@natural(1,100)'
      }]
    })
    this.dataset = data.waterBall
  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    const {
      radius
    } = this.config
    const [width, height] = this.size
    let dataset = []
    data.map((item) => {
      dataset.push([
        [item.value, 100 - item.value],
        [item.name]
      ])
    })
    //设置布局
    const clockwisePie = d3.layout.pie() //顺时针，针对数据类型:[small,bigger]
    const anticlockwisePie = d3.layout.pie() //逆时针,针对数据类型：[bigger,small]
      .startAngle(0)
      .endAngle(-2 * Math.PI)

    //设置弧生成器
    const arc = d3.svg.arc()
      .innerRadius(radius - 4)
      .outerRadius(radius);

    const xScale = d3.scale.ordinal()
      .domain(d3.range(dataset.length))
      .rangeRoundBands([0, width], 0.2)

    //处理好结构
    let ballUpdate = this.svg.selectAll('g.ball')
      .data(dataset)

    let ballEnter = ballUpdate.enter().append('g').attr('class', 'ball')
    ballUpdate.exit().remove()

    let ballGroup = this.svg.selectAll('.ball').data(dataset)
      .attr({
        'transform': (d, i) => {
          let x = xScale(i) + 100
          return 'translate(' + x + ',' + height / 2 + ')'
        }
      })

    //绘制外圈灰色圆
    ballEnter.append('circle').attr('class', 'outLine')
    let outLine = ballGroup.select('.outLine')
      .attr({
        'r': radius,
        'fill': 'none',
        'stroke': '#9f9fb3',
        'stroke-width': 1,
        'stroke-opacity': .5
      })

    //绘制外圈渐变圆
    ballEnter.append('path').attr('class', 'outCircle')
    let outCircle = ballGroup.select('.outCircle')
      .attr({
        'fill': `url(#${this.outlineGradientId})`,
        'd': (d, i) => {
          if (d[0][0] >= d[0][1]) {
            return arc(clockwisePie(d[0])[0])
          } else {
            return arc(anticlockwisePie(d[0])[0])
          }
        }
      })

    //绘制内部实心圆
    ballEnter.append('circle').attr('class', 'innerCircle')
    let innerCircle = ballGroup.select('.innerCircle')
      .attr({
        'r': radius - 8,
        'fill': 'rgba(79,35,129,0.6)'
      })

    //绘制底部名称
    ballEnter.append('text').attr('class', 'footText')
    let footText = ballGroup.select('.footText')
      .attr({
        y: radius + 30,
        'fill': '#52b8ff',
        'text-anchor': 'middle',
        'font-size': 18
      })
      .text((d, i) => {
        return d[1][0]
      })

    //绘制100%的实心圆
    ballEnter.append('circle').attr('class', 'fillCircle')
    let fillCircle = ballGroup.select('.fillCircle')
      .attr({
        'r': radius - 8,
        'fill': `url(#${this.waterGradientId})`,
        'clip-path': (d, i) => {
          return 'url(#areaWava' + i + ')'
        }
      })

    //制作波浪纹 - clipPath
    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')

    let clipPathUpdate = defs.selectAll('clipPath').data(data)
    clipPathUpdate.enter().append('clipPath').append('path')
    clipPathUpdate.exit().remove()

    let waveClipCount = 2
    let waveClipWidth = radius * 4
    let waveHeight = 10.26
    let waveOffset = 0;
    let waveCount = 1

    let wavaData = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
      wavaData.push({
        x: i / (40 * waveClipCount),
        y: (i / (40))
      });
    }

    let waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    let waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

    // translateY为radius 对应 0%
    // translateY为-radius 对应 100%
    let wavePercentScale = d3.scale.linear()
      .domain([0, 100])
      .range([radius, -radius])

    let clipArea = d3.svg.area()
      .x(function (d) {
        return waveScaleX(d.x);
      })
      .y0(function (d) {
        return waveScaleY(Math.sin(Math.PI * 2 * waveOffset * -1 + Math.PI * 2 * (1 - waveCount) + d.y * 2 * Math.PI));
      })
      .y1(function (d) {
        return 2 * radius
      });

    let clipPath = defs.selectAll('clipPath').attr({
        'id': (d, i) => {
          return 'areaWava' + i
        }
      })
      .select('path')
      .datum(wavaData)
      .attr({
        'd': clipArea,
        'fill': 'yellow',
        'T': 0
      })

    clipPath.transition()
      .duration(2000)
      .attr({
        'transform': (d, i) => {
          return 'translate(' + -3 * radius + ',' + wavePercentScale(data[i].value) + ')'
        }
      })
      .each('start', function () {
        clipPath.attr({
          'transform': (d, i) => {
            return 'translate(' + -3 * radius + ',' + radius + ')'
          }
        })
      })
    //绘制百分占比数值 -- 严格的绘制顺序决定层级
    ballEnter.append('text').attr('class', 'valueText')
    let valueText = ballGroup.select('.valueText')
      .attr({
        'fill': '#fff',
        'text-anchor': 'middle',
        'font-size': 38
      })
      .text(0)

    //value值加载动画
    let inittx = valueText.text()
    let valueTextTran = valueText.transition()
      .duration(2000)
      .tween('text', function (d, i) {
        return function (t) {
          d3.select(this).text(Math.floor(Number(inittx) + t * d[0][0]))
        }
      })
    //绘制value值百分比符号
    ballEnter.append('text').attr('class', 'percentText')
    let percentText = ballGroup.select('.percentText')
      .attr({
        y: -14,
        x: 34,
        'fill': '#fff',
        'text-anchor': 'middle',
        'font-size': 20
      })
      .text('%')

    //用定时器做波浪动画
    setTimeout(function () {
      let distance = -3 * radius
      d3.timer(waveTimer)

      function waveTimer() {
        distance++
        if (distance > -radius) {
          distance = -3 * radius
        }
        clipPath.attr({
          'transform': (d, i) => {
            return 'translate(' + distance + ',' + wavePercentScale(data[i].value) + ')'
          }
        })
      }
    }, 2000)
  }
}