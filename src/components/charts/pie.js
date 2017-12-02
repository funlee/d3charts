/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-26 21:19:41 
 * @Last Modified time:   2017-11-26 21:19:41 
 * @Description: 饼图
 */
import d3 from 'd3'
import $ from 'jquery'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import getSize from '../tool/getSize'
import fillImg from '../../img/fill.png'
export default class Pie {
  /**
   *  默认配置项
   */
  defaultSet() {
    return {
      width: 960,
      height: 500
    }
  }
  /**
   *  初始化，创建容器
   */
  constructor(selector, option) {
    const defaultSet = this.defaultSet()
    this.config = Object.assign(defaultSet, option)
    this.chartName = 'l-pie-chart'
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
    $(`.${this.chartName}`).show().siblings().hide()

    //创建图案填充
    const defs = getContainer(`.${this.chartName}`, `${this.chartName}-defs`, 'defs')
    const pattern = getContainer(`.${this.chartName}-defs`, `${this.chartName}-pattern`, 'pattern')

    pattern.attr({
      'id':`${this.chartName}-pattern`,
      'patternUnits':'objectBoundingBox',
      'x':0,
      'y':0,
      'width':1,
      'height':1
    })

    const patternImg = getContainer(`.${this.chartName}-pattern`, `${this.chartName}-pattern-img`, 'image')
    patternImg.attr({
      'xmlns:xlink':'http://www.w3.org/1999/xlink',
      'xlink:href':fillImg
    })

    //创建蒙版
    const mask = getContainer(`.${this.chartName}-defs`, `${this.chartName}-mask`, 'mask')
    mask.attr('id',`${this.chartName}-mask`)
    const maskRotate = getContainer(`.${this.chartName}-mask`, 'rotate', 'rect')
    maskRotate.attr({
      'x':480,
      'y':0,
      'width':430,
      'height':500
    })
    const maskFix = getContainer(`.${this.chartName}-mask`, 'fix', 'rect')
    maskFix.attr({
      'x':480,
      'y':0,
      'width':430,
      'height':500
    })

    this.pie = d3.layout.pie()
      .value((d) => {
        return d.value
      })
      .sort(null)

    const data = Mock.mock({
      'pie|5': [{
        'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香'],
        'value': '@natural(100,1000)'
      }]
    })
    this.dataset = data.pie
  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    const self = this
    const [width, height] = this.size
    //弧生成器
    let outerRadius = width / 6;
    let innerRadius = 0;

    this.arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    //处理数据
    let pieData = this.pie(data);
    const arcWrap = getContainer(`.${this.chartName}`, 'pie-container', 'g')
    arcWrap.attr('mask', '').style('visibility', 'hidden')
    this.svg.classed('ready', false)

    let arcsUpdate = arcWrap.selectAll('.arcs').data(pieData)
    let arcsEnter = arcsUpdate.enter().append('g').attr('class', 'arcs')

    arcsEnter.append('path').attr('class', 'arcs-path') //把PATH 加上
    arcsEnter.append('text').attr('class', 'arcs-value') //把Value值的text 加上
    arcsEnter.append('path').attr('class', 'arcs-line')

    arcsUpdate.exit().remove()

    let arcs = arcWrap.selectAll('.arcs').attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')

    let arcsPath = arcs.select('.arcs-path')
      .attr({
        'fill': `url(#${this.chartName}-pattern)`,
        'd': d => {
          return this.arc(d)
        },
        'cursor': 'pointer',
        'stroke': '#235894',
        'stroke-width': 3
      })
      .on('mousemove', function (d, i) {
        d3.select(this).attr({
          'transform': 'scale(1.1,1.1)'
        })
        // 悬浮框不做了
      })
      .on('mouseout', function () {
        d3.select(this).attr({
          'transform': 'scale(1,1)'
        })
        // 悬浮框不做了
      })

    //名称展示斜线长度基数
    let solid = 2.4 //需要大于2<-->2π
    //名称展示水平线长度
    let standard = 10
    //名称与水平线间距
    let spart = 5

    //name值展示
    let arcsText = arcs.select('.arcs-value')
      .attr({
        'transform': d => {
          let x
          let y = this.arc.centroid(d)[1] * solid
          if (parseFloat(d.endAngle.toFixed(2)) <= parseFloat(Math.PI.toFixed(2))) {
            x = this.arc.centroid(d)[0] * solid + standard + spart
          } else {
            x = this.arc.centroid(d)[0] * solid - standard - spart
          }
          return 'translate(' + x + ',' + y + ')'
        },
        'text-anchor': d => {
          if (parseFloat((d.startAngle + ((d.endAngle - d.startAngle) / 2)).toFixed(2)) <= parseFloat(Math.PI.toFixed(2))) { //判断扇形中线所在的弧度是否超过半圆
            return 'start'
          } else {
            return 'end'
          }
        },
        'dy': '.5em',
        'fill': '#235894'
      })
      .text(d => {
        return d.data.name
      })
    //画名称展示线
    let arcsLine = arcs.select('.arcs-line')
      .attr({
        'd': d => {
          let p1x = this.arc.centroid(d)[0] * 2
          let p1y = this.arc.centroid(d)[1] * 2

          let p2x = this.arc.centroid(d)[0] * solid
          let p2y = this.arc.centroid(d)[1] * solid

          let p3x
          // let p3y = p2y
          if (parseFloat((d.startAngle + ((d.endAngle - d.startAngle) / 2)).toFixed(2)) <= parseFloat(Math.PI.toFixed(2))) { //判断扇形中线所在的弧度是否超过半圆
            p3x = p2x + standard
          } else {
            p3x = p2x - standard
          }
          return 'M ' + p1x + ' ' + p1y + 'L ' + p2x + ' ' + p2y + 'L ' + p3x + ' ' + p2y
        },
        'stroke': '#235894',
        'fill': 'none',
        'stroke-width': 2
      })

    //添加蒙版动画
    setTimeout(function() {
      arcWrap.attr('mask', `url(#${self.chartName}-mask)`).style('visibility', 'visible')
      self.svg.classed('ready', true)
    }, 1000)

  }
}