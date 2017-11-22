/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-22 21:39:39 
 * @Last Modified time:   2017-11-22 21:39:39 
 * @Description: 渲染页面布局
 *               添加头部和底部
 */
import $ from 'jquery'
import bannerHbs from './hbs/banner.hbs'
import containerHbs from './hbs/container.hbs'
import footHbs from './hbs/footer.hbs'
import './css/layout.css'

export default () => {
  $('.app').append(bannerHbs())
  $('.app').append(containerHbs())
  $('.app').append(footHbs())
}