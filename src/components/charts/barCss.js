/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-26 11:19:45 
 * @Last Modified time:   2017-11-26 11:19:45 
 * @Description: 柱状图扩展--CSS
 */
import $ from 'jquery'
import d3 from 'd3'
import Mock from 'mockjs'
import getContainer from '../tool/getContainer'
import hbs from '../hbs/barCss.hbs' 
import '../style/barCss.css'

export default class BarCss {
  /**
   *  初始化，创建容器
   */
  constructor(selector, option) {
    this.chartName = 'l-bar-css-chart'
    this.ul = getContainer(selector, this.chartName, 'ul')
    $(`.${this.chartName}`).show().siblings().hide()
    
    const data = Mock.mock({
      'bar|5': [{
        'name|+1': ['龙卷风', '简单爱', '双节棍', '东风破', '七里香'],
        'value':'@natural(100,1000)'
      }]
    })
    this.dataset = data.bar
  }
  /**
   *  绘制
   */
  render(data = this.dataset) {
    data.sort(function(a, b) {
      return d3.descending(a.value, b.value)
    })
    const colors = ['#ffd43d', '#efefef', '#14c7fb', '#ffd43d', '#efefef']
    const max = d3.max(data, (d, i) => {
      return d.value
    })
    for (let i = 0, length = data.length; i < length; i++) {
      data[i].barWidth = parseInt(data[i].value) * 100 / max + '%'
      data[i].color = colors[i]
      data[i].order = i + 1
    }
    $('body').find(`.${this.chartName}`).html(hbs(data))
    setTimeout(()=>{
      $('body').find('.terminal-item').removeClass('active')
    },1000)
  }
}
