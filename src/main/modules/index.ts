import { ModuleManager } from './KModuleManager.js'
import { KMusicDatabase } from './KMusicDatabase.js'
import { KMusicMetadata } from './KMusicMetadata.js'
import { KMusicScanner } from './KMusicScanner.js'
import { KWindowControl } from './KWindowControl.js'

/** 模块添加处 */
const mods = [
  KMusicDatabase,
  KMusicMetadata,
  KMusicScanner,
  KWindowControl
] as const

/** 新架构API */
export type API = { [M in typeof mods[number] as InstanceType<M>['namespace']]: ReturnType<InstanceType<M>['provideAPI']> }
/** 模块初始化 */
export function initModules(): void { ModuleManager.init(mods) }