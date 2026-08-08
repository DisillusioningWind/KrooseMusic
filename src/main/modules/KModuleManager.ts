import { app, ipcMain } from 'electron/main'
import { KModule } from './KModule.js'
import { getIpcMethods } from '../utils/ipc.js'

/** 模块管理器 */
export class KModuleManager {
  static mods: Map<string, KModule> = new Map() // key为构造器名称

  static init(Mods: readonly (new () => KModule)[]): void {
    // 创建并注册模块
    Mods.forEach(Mod => {
      const mod = new Mod()
      this.mods.set(Mod.name, mod)
      // 注册 @IPC 装饰器标记的IPC方法
      getIpcMethods(Mod).forEach(({ method, channel }) => {
        ipcMain.handle(`${mod.namespace}:${channel}`, (_, ...args) => (mod as any)[method](...args))
      })
    })
    // 注册生命周期
    app.whenReady().then(() => { this.mods.forEach(mod => mod.onReady()) })
    app.on('will-quit', () => { this.mods.forEach(mod => mod.onQuit()) })
  }

  static getMod<T extends KModule>(name: string): T {
    const mod = this.mods.get(name)
    if (!mod) throw new Error(`Module ${name} not found`)
    return mod as T
  }
}
