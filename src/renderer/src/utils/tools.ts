const styleNameMethod = 'background-color: #606060; color: #fff; border-radius: 3px 0 0 3px; padding: 0 2px 0 2px; font-family: "Arial";'
const styleNameTime = 'background-color: #e07800; color: #fff; border-radius: 3px 0 0 3px; padding: 0 2px 0 2px; font-family: "Arial";'
const styleValue = 'background-color: #007acc; color: #fff; border-radius: 0 3px 3px 0; padding: 0 2px 0 2px; margin-right: 5px; font-family: "Arial";'
/**
 * 计算函数执行时间
 * @param _target 类的原型
 * @param propertyKey  函数名
 * @param descriptor 函数的描述符
 */
export function logTimeAsync(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value as Function
  descriptor.value = async function (...args: any[]) {
    const starTime = performance.now()
    const result = await method.call(this, ...args)
    const endTime = performance.now()
    console.log(`%cMethod Name:%c${propertyKey}%cExecute Time:%c${(endTime - starTime).toFixed(2)}ms`, styleNameMethod, styleValue, styleNameTime, styleValue)
    return result
  }
}
/**
 * 格式化时间，注意时长有可能会被截断
 * @param time 时间
 * @param option 格式化时间样式，默认为'hh:mm:ss'
 * @returns 格式化时间字符串
 */
export function formatTime(time: number, option: 'hh:mm:ss' | 'mm:ss' | 'ss' = 'hh:mm:ss') {
  const hou = Math.floor(time / 3600)
  const min = Math.floor((time % 3600) / 60).toString().padStart(2, '0')
  const sec = Math.floor(time % 60).toString().padStart(2, '0')
  switch (option) {
    case 'ss': return `${sec}`
    case 'mm:ss': return `${min}:${sec}`
    case 'hh:mm:ss': return `${hou}:${min}:${sec}`
  }
}
/**
 * 获取文件名
 * @param path 文件路径
 * @param ext 是否包含扩展名，默认为否
 * @returns 文件名
 */
export function basename(path: string, ext: boolean = false) {
  const idx = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  let name = idx === -1 ? path : path.slice(idx + 1)
  return (ext || name.indexOf('.') === -1) ? name : name.slice(0, name.lastIndexOf('.'))
}