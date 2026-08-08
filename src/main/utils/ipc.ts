/** IPC 调用通道元数据 */
const IPC_METHODS = Symbol('ipcMethods')

/** IPC 通道声明 */
export interface KIpcChannel {
  /** 类方法名 */
  method: string
  /** 对外通道名（渲染进程调用名） */
  channel: string
}

/**
 * 标记一个方法为 IPC 调用通道（渲染进程可 invoke 调用）
 * @param channel 对外通道名，缺省为方法名
 */
export function IPC(channel?: string): MethodDecorator {
  return (target, key, _descriptor) => {
    const list = ((target.constructor as any)[IPC_METHODS] ??= []) as KIpcChannel[]
    list.push({ method: String(key), channel: channel ?? String(key) })
  }
}

/** 获取模块的 IPC 调用通道列表 */
export function getIpcMethods(ctor: Function): KIpcChannel[] {
  return ((ctor as any)[IPC_METHODS] ?? []) as KIpcChannel[]
}
