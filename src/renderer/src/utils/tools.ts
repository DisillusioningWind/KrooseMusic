/**
 * 计算函数执行时间
 * @param _target 类的原型
 * @param propertyKey  函数名
 * @param descriptor 函数的描述符
 */
export function logExeTimeAsync(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  descriptor.value = async function (...args: any[]) {
    const starTime = performance.now()
    const result = await method.call(this, ...args)
    const endTime = performance.now()
    console.log(`Method Name:${propertyKey};Execute Time:${endTime - starTime}ms`)
    return result
  }
}
