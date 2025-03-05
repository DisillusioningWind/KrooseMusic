import mitt from 'mitt'

type Events = {
  ChangeDetailState: void
  ChangeDrawerState: void
  LoopMusic: { next: boolean, state: AudioState }
  LoadMusic: { path: string, auto?: boolean }
  UnloadMusic: void
  UpdateMusic: { time: number, offset?: boolean }
  ChangeMusicState: void
  ChangeMusicMute: void
  ChangeMusicVolume: number
  musicLoad: void
  musicUnload: void
  musicEnd: void
  musicUpdate: number
  musicStateChange: string
  musicDurChange: number
}

class EventBus {
  emitter = mitt<Events>()
  /** 使详情状态改变 */
  onChangeDetailState(h: () => void) { this.emitter.on('ChangeDetailState', h) }
  emChangeDetailState() { this.emitter.emit('ChangeDetailState') }
  /** 使抽屉状态改变 */
  onChangeDrawerState(h: () => void) { this.emitter.on('ChangeDrawerState', h) }
  emChangeDrawerState() { this.emitter.emit('ChangeDrawerState') }
  /** 使播放器循环音乐 @param next 是否播放下/上一首 @param state 当前音乐播放状态 */
  onLoopMsc(h: (next: boolean, state: AudioState) => void) { this.emitter.on('LoopMusic', (e) => h(e.next, e.state)) }
  emLoopMsc(next: boolean, state: AudioState) { this.emitter.emit('LoopMusic', { next, state }) }
  /** 使播放器加载音乐 @param path 路径 @param auto 是否自动播放 */
  onLoadMsc(h: (path: string, auto?: boolean) => void) { this.emitter.on('LoadMusic', (e) => h(e.path, e.auto)) }
  emLoadMsc(path: string, auto?: boolean) { this.emitter.emit('LoadMusic', { path, auto }) }
  /** 使播放器卸载音乐 */
  onUnloadMsc(h: () => void) { this.emitter.on('UnloadMusic', h) }
  emUnloadMsc() { this.emitter.emit('UnloadMusic') }
  /** 使播放器更新音乐进度 @param time 时间 @param offset 是否偏移 */
  onUpdateMsc(h: (time: number, offset?: boolean) => void) { this.emitter.on('UpdateMusic', (e) => h(e.time, e.offset)) }
  emUpdateMsc(time: number, offset?: boolean) { this.emitter.emit('UpdateMusic', { time, offset }) }
  /** 使播放器改变状态 */
  onChangeMscState(h: () => void) { this.emitter.on('ChangeMusicState', h) }
  emChangeMscState() { this.emitter.emit('ChangeMusicState') }
  /** 使播放器改变静音 */
  onChangeMscMute(h: () => void) { this.emitter.on('ChangeMusicMute', h) }
  emChangeMscMute() { this.emitter.emit('ChangeMusicMute') }
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
}
const bus = new EventBus()
export default bus
