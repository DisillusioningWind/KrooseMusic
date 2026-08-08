import { KModuleManager } from './KModuleManager.js'
import { KMusicDatabase } from './KMusicDatabase.js'
import { KMusicMetadata } from './KMusicMetadata.js'
import { KMusicScanner } from './KMusicScanner.js'
import { KWindowManager } from './KWindowManager.js'

/** 模块添加处 */
const mods = [
  KMusicDatabase,
  KMusicMetadata,
  KMusicScanner,
  KWindowManager
] as const

/** 模块初始化 */
export function initModules(): void { KModuleManager.init(mods) }