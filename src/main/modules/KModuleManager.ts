import { ipcMain } from 'electron/main'
import { KModule } from './KModule.js'

/** 模块管理器 */
export class ModuleManager {
  static mods: Map<string, KModule> = new Map() // key为构造器名称
  static apis: Record<string, string[]> = {} // key为namespace

  static init(Mods: readonly (new () => KModule)[]): void {
    // 实例并注册模块
    Mods.forEach(Mod => {
      const mod = new Mod()
      this.mods.set(Mod.name, mod)
      this.apis[mod.namespace] = Object.keys(mod.provideAPI())
      mod.registerAPI()
    })
    // 注册获取API
    ipcMain.handle('getNewAPI', () => this.apis)
  }

  static get<T extends KModule>(name: string): T {
    const mod = this.mods.get(name)
    if (!mod) throw new Error(`Module ${name} not found`)
    return mod as T
  }
}