/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 10:05:15 
 * @Last Modified time:   2017-11-24 10:05:15 
 * @Description: 获取SVG容器的大小
 *               为了扩展支持百分比
 *               返回[width,height]
 */
import $ from 'jquery'
export default (seletor, w, h) => {
  const contain = $(seletor)
  let width, height
  if (typeof w === 'string' && w.indexOf('%' != -1)) {
    width = Math.floor(contain.width() * parseInt(w, 10) / 100)
  } else {
    width = w
  }
  if (typeof h === 'string' && h.indexOf('%' != -1)) {
    height = Math.floor(contain.height() * parseInt(h, 10) / 100)
  } else {
    height = h
  }
  return [width, height]
}