import Bar from './charts/bar'
import BarNormal from './charts/barNormal'
import BarMask from './charts/barMask'
import BarPath from './charts/barPath'
import BarCss from './charts/barCss'
import Line from './charts/line'
import Area from './charts/area'
import Pie from './charts/pie'
import WaterBall from './charts/waterBall'
import Radar from './charts/radar'
import Triangle from './charts/triangle'
import Map from './charts/map'

export default (chartType) =>{
  const config = {}
  switch (chartType) {
    case 'bar':
      new Bar('.l-chart', config).render()
      break;
    case 'barNormal':
      new BarNormal('.l-chart', config).render()
      break;
    case 'barMask':
      new BarMask('.l-chart', config).render()
      break;
    case 'barPath':
      new BarPath('.l-chart', config).render()
      break;
    case 'barCss':
      new BarCss('.l-chart', config).render()
      break;
    case 'line':
      new Line('.l-chart', config).render()
      break;
    case 'area':
      new Area('.l-chart', config).render()
      break;
    case 'pie':
      new Pie('.l-chart', config).render()
      break;
    case 'waterBall':
      new WaterBall('.l-chart', config).render()
      break;
    case 'radar':
      new Radar('.l-chart', config).render()
      break;
    case 'triangle':
      new Triangle('.l-chart',config).render()
      break;
    case 'map':
      new Map('.l-chart',config).render()
      break;
    default:
      break;
  }
}