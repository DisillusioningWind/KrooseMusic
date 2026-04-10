import { app, ipcMain } from 'electron/main'
import { KModule } from './KModule.js'

/** 模块管理器 */
export class KModuleManager {
  static mods: Map<string, KModule> = new Map() // key为构造器名称
  static apis: Record<string, string[]> = {} // key为namespace

  static init(Mods: readonly (new () => KModule)[]): void {
    // 创建并注册模块
    Mods.forEach(Mod => {
      const mod = new Mod()
      const api = mod.provideAPI()

      this.mods.set(Mod.name, mod)
      this.apis[mod.namespace] = Object.keys(api)
      // 注册模块API
      Object.entries(api).forEach(([channel, handler]) => {
        ipcMain.handle(`${mod.namespace}:${channel}`, (_, ...args) => handler.bind(mod)(...args))
      })
    })
    // 注册获取API
    ipcMain.handle('getAllAPI', () => this.apis)
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