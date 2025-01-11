import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'

type AudioState = 'unload' | 'loading' | 'play' | 'pause' | 'stop'
export const useAudioStore = defineStore('audio', () => {
  const audio = new Audio()
  const state = ref<AudioState>('unload')// 播放状态
  const autoplay = ref(true)// 是否自动播放
  const volume = ref(100)// 音量
  const duration = ref(0)// 时长
  const curtime = ref(0)// 当前进度
  // 发射事件
  audio.oncanplay = () => { if (state.value === 'loading') bus.emMscLoad() }// 音乐加载完成
  audio.onended = () => { bus.emMscEnd() }// 音乐结束
  audio.ontimeupdate = () => { bus.emMscUpdate(audio.currentTime) }// 音乐进度更新
  watch(state, state => { bus.emMscStateChange(state); if (state === 'unload') bus.emMscUnload() })// 状态改变及音乐卸载
  watch(duration, dur => { bus.emMscDurChange(dur) })// 时长改变
  watch(volume, vol => { audio.volume = vol * 0.01 })// 音量改变
  // 监听事件
  bus.onMscLoad(loadEnd)// 音乐加载完成时决定是否自动播放
  bus.onMscEnd(stop)// 音乐结束时停止播放
  bus.onMscUpdate(time => { curtime.value = time })// 音乐进度更新
  bus.onLoadMsc(load)// 外部命令加载音乐
  bus.onUnloadMsc(unload)// 外部命令卸载音乐
  bus.onUpdateMsc(changeTime)// 外部命令更新音乐进度
  bus.onChangeMscState(changeState)// 外部命令改变播放状态
  bus.onChangeMscVol(vol => { volume.value = vol })// 外部命令改变音量
  // 控制方法
  function load(path: string) {
    state.value = 'loading'
    // 本地文件路径转URL
    audio.src = window.url.pathToFileURL(path).href
  }
  function loadEnd() {
    duration.value = audio.duration
    state.value = 'stop'
    if (autoplay.value) play()
  }
  function unload() {
    audio.src = ''
    duration.value = 0
    state.value = 'unload'
  }
  function play() {
    if (state.value !== 'pause' && state.value !== 'stop') return
    audio.play()
    state.value = 'play'
  }
  function pause() {
    if (state.value !== 'play') return
    audio.pause()
    state.value = 'pause'
  }
  function stop() {
    if (state.value !== 'play' && state.value !== 'pause') return
    audio.pause()
    audio.currentTime = 0
    state.value = 'stop'
  }
  // 转换为播放或暂停状态
  function changeState() {
    if (state.value === 'play') pause()
      else if (state.value === 'pause' || state.value === 'stop') play()
  }
  // 更新音乐进度，offset为true时使用偏移值
  function changeTime(time: number, offset: boolean = false) {
    if (offset) audio.currentTime += time
    else audio.currentTime = time
  }
  return {
    /** 播放状态，禁止外部直接更改 */
    mscState: state,
    /** 音量 */
    mscVol: volume,
    /** 总时长，禁止外部更改 */
    mscDur: duration,
    /** 当前进度，禁止外部直接更改 */
    mscTime: curtime
  }
})
