import { KModuleManager } from './KModuleManager.js'

/** 通用模块接口 */
export abstract class KModule {
  /** 命名空间，用于渲染进程调用时区分模块 */
  abstract readonly namespace: string
  /** 获取依赖模块 */
  getMod<T extends KModule>(Mod: new () => T): T { return KModuleManager.getMod<T>(Mod.name) }

  /** APP启动时 */
  onReady(): void {}
  /** APP退出时 */
  onQuit(): void {}
}
