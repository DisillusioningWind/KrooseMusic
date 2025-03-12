import hotkeys from 'hotkeys-js'
import bus from '@renderer/utils/emitter'

class KHotKey {
  constructor() {
    hotkeys('f12', this.winOpenDevTool)
    hotkeys('f5', this.winReload)
    hotkeys('space', this.mscChangeState)
  }
  // 窗口打开开发者工具
  winOpenDevTool() { window.api.openDevTools() }
  // 窗口刷新页面
  winReload() { window.api.reloadWindow() }
  // 音乐播放/暂停
  mscChangeState() { bus.emChangeMscState() }
}

export function createHotKey() {
  return new KHotKey()
}