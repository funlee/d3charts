/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 11:10:53 
 * @Last Modified time:   2017-11-24 11:10:53 
 * @Description: 悬浮框公用方法
 */
import $ from 'jquery'
import getContainer from './getContainer'
export default (option) => {
  const { location: { x, y }, data } = option
  let text = ''
  data.map((d) => {
    text += `${d.name} : ${d.value}<br/>`
  })

  const el = getContainer('body', 'l-tooltip', 'div')
  $('.l-tooltip').css({
      'left': x,
      'top': y,
      'box-sizing': ' border-box',
      'position': ' absolute',
      'padding': ' 10px 15px',
      'background': 'linear-gradient( -90deg, rgb(7,8,74) 0%, rgb(1,2,27) 90%)',
      'border-radius': ' 5px',
      'border': ' 1px solid #928a82',
      'color': ' #e7f3fe',
      'font-size': ' 16px',
      'z-index': ' 10',
      'white-space': ' nowrap'
    })
    .html(text)
  return $('.l-tooltip')
}