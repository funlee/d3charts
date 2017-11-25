/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 09:26:45 
 * @Last Modified time:   2017-11-24 09:26:45 
 * @Description: 在父级容器container下寻找指定tag[class="className"]的容器
 *               有则返回这个目标容器
 *               无则创建
 */
import * as d3 from 'd3'
export default (container, className, tag = 'g') => {
  const isExit = d3.select(container).select('.' + className).empty()
  let wrap
  if (isExit) {
    wrap = d3.select(container).append(tag).attr('class', className)
  } else {
    wrap = d3.select(container).select('.' + className)
  }
  return wrap
}