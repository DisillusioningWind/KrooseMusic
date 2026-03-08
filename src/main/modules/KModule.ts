import { ipcMain } from 'electron/main'
import { ModuleManager } from './KModuleManager.js'

/** 通用模块接口 */
export abstract class KModule {
  abstract readonly namespace: string
  /** 提供API接口 */
  abstract provideAPI(): Record<string, Function>
  /** 注册API接口 */
  registerAPI(): void {
    Object.entries(this.provideAPI()).forEach(([channel, handler]) => {
      const bindHandler = handler.bind(this)
      ipcMain.handle(`${this.namespace}:${channel}`, (_, ...args) => bindHandler(...args))
    })
  }
  /** 获取依赖模块 */
  get<T extends KModule>(Mod: new () => T): T {
    return ModuleManager.get<T>(Mod.name)
  }
}