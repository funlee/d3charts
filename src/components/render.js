import Bar from './charts/bar'
import BarNormal from './charts/barNormal'
import BarMask from './charts/barMask'
import BarPath from './charts/barPath'
import BarCss from './charts/barCss'
import Line from './charts/line'
import Area from './charts/area'
import Pie from './charts/pie'

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
    default:
      break;
  }
}