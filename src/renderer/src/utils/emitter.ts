import mitt from 'mitt'

type Events = {
  musicPlay: void
  musicPause: void
  musicStop: void
  musicEnd: void
  musicUnload: void
  musicCanPlay: void
  musicUpdateCur: number
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
  /** 音乐卸载 */
  musicUnload(h: () => void) { this.emitter.on('musicUnload', h) }
  musicUnloadEmit() { this.emitter.emit('musicUnload') }
  /** 音乐加载完成 */
  musicCanPlay(h: () => void) { this.emitter.on('musicCanPlay', h) }
  musicCanPlayEmit() { this.emitter.emit('musicCanPlay') }
  /** 音乐更新当前值 @param cur 当前值 */
  musicUpdateCur(h: (cur: number) => void) { this.emitter.on('musicUpdateCur', h) }
  musicUpdateCurEmit(cur: number) { this.emitter.emit('musicUpdateCur', cur) }
}
export const bus = new EventBus()
