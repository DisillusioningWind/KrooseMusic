import mitt from 'mitt'

type Events = {
  musicPlay: void
  musicPause: void
  musicStop: void
  musicEnd: void
  musicLoad: void
  musicInfoLoad: void
  musicUnload: void
  musicUpdateCur: number
  dbOpen: void
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
  /** 音乐加载完成 */
  musicLoad(h: () => void) { this.emitter.on('musicLoad', h) }
  musicLoadEmit() { this.emitter.emit('musicLoad') }
  /** 音乐信息加载完成 */
  musicInfoLoad(h: () => void) { this.emitter.on('musicInfoLoad', h) }
  musicInfoLoadEmit() { this.emitter.emit('musicInfoLoad') }
  /** 音乐卸载 */
  musicUnload(h: () => void) { this.emitter.on('musicUnload', h) }
  musicUnloadEmit() { this.emitter.emit('musicUnload') }
  /** 音乐更新当前值 @param cur 当前值 */
  musicUpdateCur(h: (cur: number) => void) { this.emitter.on('musicUpdateCur', h) }
  musicUpdateCurEmit(cur: number) { this.emitter.emit('musicUpdateCur', cur) }
  /** 数据库打开 */
  dbOpen(h: () => void) { this.emitter.on('dbOpen', h) }
  dbOpenEmit() { this.emitter.emit('dbOpen') }
}
const bus = new EventBus()
export default bus
