/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-12-04 15:01:30 
 * @Last Modified time:   2017-12-04 15:01:30 
 * @Description: 绘制中国南海地图
 */
export default (svg,trX=680,trY=410,scale=0.5) => {
  const southchinasea = `<g xmlns="http://www.w3.org/2000/svg" id="southchinasea" transform="translate(${trX},${trY})scale(${scale})"` + 
  ` class="southchinasea" stroke-width="1" fill="skyblue" stroke="black">
  <title>South China Sea</title>
  <line id="svg_1" y2="7" x2="145" y1="7" x1="20"></line>
  <line id="svg_2" y2="24" x2="6" y1="7" x1="20"></line>
  <line id="svg_3" y2="195" x2="145" y1="7" x1="145"></line>
  <line id="svg_4" y2="195" x2="6" y1="24" x1="6"></line>
  <line id="svg_5" y2="195" x2="145" y1="195" x1="6"></line>
  <path id="svg_6" d="m6,31.5l9,7.5l15,9l15,4l18,0l17,-14l21,-31L20,7L6,24z"></path>
  <path id="svg_7" d="m113,7l10,25l11,-25z"></path>
  <path id="svg_9" d="m46.5,66.5l14.5,-6.5l-1,13l-7,7l-15,4l8.5,-17.5z"></path>
  <line id="svg_10" y2="46.5" x2="132.5" y1="31.5" x1="141.5"></line>
  <line id="svg_11" y2="76.5" x2="115.5" y1="61.5" x1="121.5"></line>
  <line id="svg_12" y2="111.5" x2="110.5" y1="92.5" x1="110.5"></line>
  <line id="svg_13" y2="147.5" x2="101.5" y1="127.5" x1="108.5"></line>
  <line id="svg_14" y2="177.5" x2="78.5" y1="163.5" x1="91.5"></line>
  <line id="svg_15" y2="188.5" x2="39.5" y1="184.5" x1="54.5"></line>
  <line id="svg_16" y2="158.5" x2="11.5" y1="172.5" x1="17.5"></line>
  <line id="svg_17" y2="132.5" x2="39.5" y1="142.5" x1="24.5"></line>
  <line id="svg_18" y2="98.5" x2="37.5" y1="113.5" x1="40.5"></line>
 </g>`
  svg.html(function (d) {
    return d3.select(this).html() + southchinasea
  })
}
