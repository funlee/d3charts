/*
 * @Author: funlee 
 * @Email: i@funlee.cn 
 * @Date: 2017-11-24 15:51:46 
 * @Last Modified time:   2017-11-24 15:51:46 
 * @Description: 随机生成的ID
 */
export default ( () => {
  let id = 1
  return () => {
    let prefix = new Date().valueOf()
    return `hyfe-${prefix}-${id++}`
  }
})()