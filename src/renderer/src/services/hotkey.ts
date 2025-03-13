import hotkeys from 'hotkeys-js'
import bus from '@renderer/utils/emitter'

class KHotKey {
  private keyOpenDevTool = 'f12'
  private keyReload = 'f5'
  private keyChangeState = 'space'
  private keyFastForward = 'right'
  private keyFastBackward = 'left'
  private keyMute = 'ctrl+m'
  private keyVolUp = 'up'
  private keyVolDown = 'down'
  // 绑定快捷键
  constructor() {
    hotkeys(this.keyOpenDevTool, this.winOpenDevTool)
    hotkeys(this.keyReload, this.winReload)
    hotkeys(this.keyChangeState, this.mscChangeState)
    hotkeys(this.keyFastForward, this.mscFastForward)
    hotkeys(this.keyFastBackward, this.mscFastBackward)
    hotkeys(this.keyMute, this.mscMute)
    hotkeys(this.keyVolUp, this.mscVolUp)
    hotkeys(this.keyVolDown, this.mscVolDown)
  }
  // 窗口打开开发者工具
  winOpenDevTool() { window.api.openDevTools() }
  // 窗口刷新页面
  winReload() { window.api.reloadWindow() }
  // 音乐播放/暂停
  mscChangeState() { bus.emChangeMscState() }
  // 音乐快进
  mscFastForward() { bus.emUpdateMsc(10, true) }
  // 音乐快退
  mscFastBackward() { bus.emUpdateMsc(-10, true) }
  // 音乐静音
  mscMute() { bus.emChangeMscMute() }
  // 音乐提高音量
  mscVolUp() { bus.emChangeMscVol(5, true) }
  // 音乐降低音量
  mscVolDown() { bus.emChangeMscVol(-5, true) }
}

export function createHotKey() {
  return new KHotKey()
}