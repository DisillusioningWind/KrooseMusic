import mitt from 'mitt'

type Events = {
  musicLoad: void
  musicInfoLoad: void
  musicUpdateCur: number
  musicEnd: void
  musicUnload: void
  dbOpen: void
}

class EventBus {
  emitter = mitt<Events>()
  /** 音乐加载完成 */
  onMusicLoad(h: () => void) { this.emitter.on('musicLoad', h) }
  emitMusicLoad() { this.emitter.emit('musicLoad') }
  /** 音乐信息加载完成 */
  onMusicInfoLoad(h: () => void) { this.emitter.on('musicInfoLoad', h) }
  emitMusicInfoLoad() { this.emitter.emit('musicInfoLoad') }
  /** 音乐更新当前值 @param cur 当前值 */
  onMusicUpdateCur(h: (cur: number) => void) { this.emitter.on('musicUpdateCur', h) }
  emitMusicUpdateCur(cur: number) { this.emitter.emit('musicUpdateCur', cur) }
  /** 音乐结束 */
  onMusicEnd(h: () => void) { this.emitter.on('musicEnd', h) }
  emitMusicEnd() { this.emitter.emit('musicEnd') }
  /** 音乐卸载 */
  onMusicUnload(h: () => void) { this.emitter.on('musicUnload', h) }
  emitMusicUnload() { this.emitter.emit('musicUnload') }
  /** 数据库打开 */
  onDbOpen(h: () => void) { this.emitter.on('dbOpen', h) }
  emitDbOpen() { this.emitter.emit('dbOpen') }
}
const bus = new EventBus()
export default bus
