/**
 * 页面布局初始化
 */
import $ from 'jquery'
import bannerHbs from './hbs/banner.hbs'
import containerHbs from './hbs/container.hbs'
import layerHbs from './hbs/layer.hbs'
import footHbs from './hbs/footer.hbs'
import './css/app.css'

import render from './components/render'

$('.app').append(bannerHbs())
$('.app').append(containerHbs())
$('.app').append(layerHbs())
$('.app').append(footHbs())

$('.app').on('click', '.l-card', function () {
  $('.l-layer').show()
  render($(this).attr('data-chart'))
})
$('.app').on('click', '.l-layer-close', function () {
  $('.l-layer').hide()
})