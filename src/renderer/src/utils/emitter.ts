import mitt from 'mitt'

type Events = {
  musicPlay: void
  musicPause: void
  musicStop: void
  musicEnd: void
  musicReset: void
  musicCanPlay: void
  musicUpdateCur: number
  menuSelect: { uid: number; value: string }
}

class EventBus {
  emitter = mitt<Events>()
  /** 音乐播放 */
  musicPlay(h: () => void) { this.emitter.on('musicPlay', h) }
  musicPlayEmit() { this.emitter.emit('musicPlay') }
  /** 音乐暂停 */
  musicPause(h: () => void) { this.emitter.on('musicPause', h) }
  musicPauseEmit() { this.emitter.emit('musicPause') }
  /** 音乐停止 */
  musicStop(h: () => void) { this.emitter.on('musicStop', h) }
  musicStopEmit() { this.emitter.emit('musicStop') }
  /** 音乐结束 */
  musicEnd(h: () => void) { this.emitter.on('musicEnd', h) }
  musicEndEmit() { this.emitter.emit('musicEnd') }
  /** 音乐重置 */
  musicReset(h: () => void) { this.emitter.on('musicReset', h) }
  musicResetEmit() { this.emitter.emit('musicReset') }
  /** 音乐加载完成 */
  musicCanPlay(h: () => void) { this.emitter.on('musicCanPlay', h) }
  musicCanPlayEmit() { this.emitter.emit('musicCanPlay') }
  /** 音乐更新当前值 @param cur 当前值 */
  musicUpdateCur(h: (cur: number) => void) { this.emitter.on('musicUpdateCur', h) }
  musicUpdateCurEmit(cur: number) { this.emitter.emit('musicUpdateCur', cur) }
  /**
   * 菜单选择
   * @param uid 监听组件标识
   * @param value 选项名称
   */
  menuSelect(h: (data: { uid: number; value: string }) => void) { this.emitter.on('menuSelect', h) }
  menuSelectEmit(data: { uid: number; value: string }) { this.emitter.emit('menuSelect', data) }
}
export const bus = new EventBus()
