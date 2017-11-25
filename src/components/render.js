import Bar from './charts/bar'
import BarNormal from './charts/barNormal'
import BarMask from './charts/barMask'

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
    default:
      break;
  }
}