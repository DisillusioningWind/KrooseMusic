import mitt from 'mitt'

type Events = {
  ChangeDetailState: void
  ChangeDrawerState: void
  ChangeTooltipState: { show: boolean, text?: string, x?: number, y?: number }
  LoopMusic: boolean
  LoadMusic: { path: string, auto?: boolean }
  UnloadMusic: void
  UpdateMusic: { time: number, offset?: boolean }
  ChangeMusicState: void
  ChangeMusicMute: void
  ChangeMusicVolume: { vol: number, offset?: boolean }
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
  /** 使悬停提示状态改变 @param show 是否显示 @param text 文本 @param x x坐标 @param y y坐标 */
  onChangeTooltipState(h: (show: boolean, text?: string, x?: number, y?: number) => void) { this.emitter.on('ChangeTooltipState', e => h(e.show, e.text, e.x, e.y)) }
  emChangeTooltipState(show: boolean, text?: string, x?: number, y?: number) { this.emitter.emit('ChangeTooltipState', { show, text, x, y }) }
  /** 使播放器循环音乐 @param next 是否下一首 */
  onLoopMsc(h: (next: boolean) => void) { this.emitter.on('LoopMusic', h) }
  emLoopMsc(next: boolean) { this.emitter.emit('LoopMusic', next) }
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
  /** 使播放器改变音量 @param vol 音量 @param offset 是否偏移 */
  onChangeMscVol(h: (vol: number, offset?: boolean) => void) { this.emitter.on('ChangeMusicVolume', (e) => h(e.vol, e.offset)) }
  emChangeMscVol(vol: number, offset?: boolean) { this.emitter.emit('ChangeMusicVolume', { vol, offset }) }
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
