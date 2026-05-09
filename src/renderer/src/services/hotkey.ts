import hotkeys from 'hotkeys-js'
import { getAudioManager } from '@renderer/store/KAudioManager'

class KHotKey {
  private hotKeyMaps = new Map<() => void, string>()

  constructor() {
    this.hotKeyMaps.set(this.winOpenDevTool, 'f12')
    this.hotKeyMaps.set(this.winReload, 'f5')
    this.hotKeyMaps.set(this.mscChangeState, 'space')
    this.hotKeyMaps.set(this.mscFastForward, 'right')
    this.hotKeyMaps.set(this.mscFastBackward, 'left')
    this.hotKeyMaps.set(this.mscMute, 'ctrl+m')
    this.hotKeyMaps.set(this.mscVolUp, 'up')
    this.hotKeyMaps.set(this.mscVolDown, 'down')
    // 绑定快捷键
    this.hotKeyMaps.forEach((key, func) => {
      hotkeys(key, func)
    })
  }
  // 窗口打开开发者工具
  winOpenDevTool() {
    window.api.win.openDevTools()
  }
  // 窗口刷新页面
  winReload() {
    window.api.win.reloadWindow()
  }
  // 音乐播放/暂停
  mscChangeState() {
    getAudioManager().changeStat()
  }
  // 音乐快进
  mscFastForward() {
    getAudioManager().changeTime(10, true)
  }
  // 音乐快退
  mscFastBackward() {
    getAudioManager().changeTime(-10, true)
  }
  // 音乐静音
  mscMute() {
    getAudioManager().changeMute()
  }
  // 音乐提高音量
  mscVolUp() {
    getAudioManager().changeVolu(5, true)
  }
  // 音乐降低音量
  mscVolDown() {
    getAudioManager().changeVolu(-5, true)
  }
}

export function createHotKey() {
  return new KHotKey()
}