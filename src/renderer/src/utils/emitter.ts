import mitt from 'mitt'

type Events = {
  ChangeDetailState: void
  ChangeDrawerState: void
  LoopMusic: boolean
  LoadMusic: string
  UnloadMusic: void
  UpdateMusic: [number, boolean?]
  ChangeMusicState: void
  ChangeMusicVolume: number
  musicLoad: void
  musicUnload: void
  musicEnd: void
  musicUpdate: number
  musicStateChange: string
  musicDurChange: number
  dbOpen: void
}

class EventBus {
  emitter = mitt<Events>()
  /** 使详情状态改变 */
  onChangeDetailState(h: () => void) { this.emitter.on('ChangeDetailState', h) }
  emChangeDetailState() { this.emitter.emit('ChangeDetailState') }
  /** 使抽屉状态改变 */
  onChangeDrawerState(h: () => void) { this.emitter.on('ChangeDrawerState', h) }
  emChangeDrawerState() { this.emitter.emit('ChangeDrawerState') }
  /** 使播放器循环音乐 @param next 是否下一首 */
  onLoopMsc(h: (next: boolean) => void) { this.emitter.on('LoopMusic', h) }
  emLoopMsc(next: boolean) { this.emitter.emit('LoopMusic', next) }
  /** 使播放器加载音乐 @param path 音乐路径 */
  onLoadMsc(h: (path: string) => void) { this.emitter.on('LoadMusic', h) }
  emLoadMsc(path: string) { this.emitter.emit('LoadMusic', path) }
  /** 使播放器卸载音乐 */
  onUnloadMsc(h: () => void) { this.emitter.on('UnloadMusic', h) }
  emUnloadMsc() { this.emitter.emit('UnloadMusic') }
  /** 使播放器更新音乐 @param cur 当前进度 @param offset 是否使用偏移 */
  onUpdateMsc(h: (cur: number, offset?: boolean) => void) { this.emitter.on('UpdateMusic', (e) => h(e[0], e[1])) }
  emUpdateMsc(cur: number, offset?: boolean) { this.emitter.emit('UpdateMusic', [cur, offset]) }
  /** 使播放器改变状态 */
  onChangeMscState(h: () => void) { this.emitter.on('ChangeMusicState', h) }
  emChangeMscState() { this.emitter.emit('ChangeMusicState') }
  /** 使播放器改变音量 @param vol 音量 */
  onChangeMscVol(h: (vol: number) => void) { this.emitter.on('ChangeMusicVolume', h) }
  emChangeMscVol(vol: number) { this.emitter.emit('ChangeMusicVolume', vol) }
  /** 播放器音乐加载完成 */
  onMscLoad(h: () => void) { this.emitter.on('musicLoad', h) }
  emMscLoad() { this.emitter.emit('musicLoad') }
  /** 播放器音乐卸载完成 */
  onMscUnload(h: () => void) { this.emitter.on('musicUnload', h) }
  emMscUnload() { this.emitter.emit('musicUnload') }
  /** 播放器音乐结束 */
  onMscEnd(h: () => void) { this.emitter.on('musicEnd', h) }
  emMscEnd() { this.emitter.emit('musicEnd') }
  /** 播放器音乐更新当前进度 @param cur 当前进度 */
  onMscUpdate(h: (cur: number) => void) { this.emitter.on('musicUpdate', h) }
  emMscUpdate(cur: number) { this.emitter.emit('musicUpdate', cur) }
  /** 播放器音乐状态改变 @param state 状态 */
  onMscStateChange(h: (state: string) => void) { this.emitter.on('musicStateChange', h) }
  emMscStateChange(state: string) { this.emitter.emit('musicStateChange', state) }
  /** 播放器音乐时长改变 @param dur 时长 */
  onMscDurChange(h: (dur: number) => void) { this.emitter.on('musicDurChange', h) }
  emMscDurChange(dur: number) { this.emitter.emit('musicDurChange', dur) }
  /** 数据库打开完成 */
  onDbOpen(h: () => void) { this.emitter.on('dbOpen', h) }
  emitDbOpen() { this.emitter.emit('dbOpen') }
}
const bus = new EventBus()
export default bus
