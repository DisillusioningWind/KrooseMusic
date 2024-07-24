/**
 * 计算函数执行时间
 * @param _target 类的原型
 * @param propertyKey  函数名
 * @param descriptor 函数的描述符
 */
export function logExeTimeAsync(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  const styleNameMethod = 'background-color: #606060; color: #fff; border-radius: 3px 0 0 3px; padding: 0 2px 0 2px; font-family: "Arial";'
  const styleNameTime = 'background-color: #e07800; color: #fff; border-radius: 3px 0 0 3px; padding: 0 2px 0 2px; font-family: "Arial";'
  const styleValue = 'background-color: #007acc; color: #fff; border-radius: 0 3px 3px 0; padding: 0 2px 0 2px; margin-right: 5px; font-family: "Arial";'
  descriptor.value = async function (...args: any[]) {
    const starTime = performance.now()
    const result = await method.call(this, ...args)
    const endTime = performance.now()
    console.log(`%cMethod Name:%c${propertyKey}%cExecute Time:%c${(endTime - starTime).toFixed(2)}ms`, styleNameMethod, styleValue, styleNameTime, styleValue)
    return result
  }
}

/**
 *  格式化时间，注意时长有可能会被截断
 * @param time 时间
 * @param option 格式化时间样式，默认为'hh:mm:ss'
 * @returns 格式化时间字符串
 */
export function formatTime(time: number, option?: 'hh:mm:ss' | 'mm:ss' | 'ss') {
  const hour = Math.floor(time / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  const pad = (num: number) => num.toString().padStart(2, '0')
  const minStr = pad(min)
  const secStr = pad(sec)

  let formattedTime = ''
  switch (option) {
    case 'mm:ss':
      formattedTime = `${minStr}:${secStr}`
      break
    case 'ss':
      formattedTime = `${secStr}`
      break
    case 'hh:mm:ss':
    default:
      formattedTime = `${hour}:${minStr}:${secStr}`
  }
  return formattedTime
}
