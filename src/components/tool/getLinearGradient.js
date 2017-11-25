/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 15:49:54 
 * @Last Modified time:   2017-11-24 15:49:54 
 * @Description: 返回创建好的渐变SVG-DOM及其对应的id
 */
import getIdRandom from './getIdRandom'
export default (color) => {
  const { x1,y1,x2,y2,colorStops } = color
  const gradientId = getIdRandom()
  let gradientDOM = `<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`
  colorStops.map((d) =>{
    gradientDOM += `<stop offset="${d.offset}%" style="stop-color:${d.color};stop-opacity:${d.opacity}"/>`
  })
  gradientDOM += `</linearGradient>`
  return {
    dom:gradientDOM,
    id:gradientId
  }
}