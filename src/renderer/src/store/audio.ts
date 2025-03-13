import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'

/** 音乐播放控制 */
export const useAudioStore = defineStore('store-audio', () => {
  const audio = new Audio()
  const state = ref<AudioState>('unload')// 播放状态
  const autoplay = ref(true)// 是否自动播放
  const mute = ref(false)// 是否静音
  const volume = ref(100)// 音量
  const duration = ref(0)// 时长
  const curtime = ref(0)// 当前进度
  // 发射事件
  audio.oncanplay = () => { if (state.value === 'loading') bus.emMscLoad() }// 音乐加载完成后发射音乐加载事件
  audio.onended = () => { stop(); bus.emMscEnd() }// 停止播放后发射音乐结束事件
  audio.ontimeupdate = () => { bus.emMscUpdate(audio.currentTime) }// 音乐进度更新
  watch(state, state => { bus.emMscStateChange(state); if (state === 'unload') bus.emMscUnload() })// 状态改变及音乐卸载
  watch(duration, dur => { bus.emMscDurChange(dur) })// 时长改变
  watch([volume, mute], ([vol, mute]) => { audio.volume = mute ? 0 : vol * 0.01 })// 音量及静音改变
  // 监听事件
  bus.onMscLoad(loadEnd)// 音乐加载完成时决定是否自动播放
  bus.onMscUpdate(time => { curtime.value = time })// 音乐进度更新
  bus.onLoadMsc(load)// 外部命令加载音乐
  bus.onUnloadMsc(unload)// 外部命令卸载音乐
  bus.onChangeMscState(changeState)// 外部命令更新播放状态
  bus.onUpdateMsc(changeTime)// 外部命令更新音乐进度
  bus.onChangeMscVol(changeVol)// 外部命令更新音乐音量
  bus.onChangeMscMute(() => { mute.value = !mute.value })// 外部命令更新静音状态
  // 音乐控制
  function load(path: string, auto: boolean = true) {
    // 播放状态为播放或暂停时，此次加载为强制切换，是否自动播放取决于播放状态，忽略auto参数
    // 播放状态为停止时，此次加载为正常加载，是否自动播放取决于auto参数
    autoplay.value = state.value === 'play' ? true : state.value === 'pause' ? false : auto
    state.value = 'loading'
    audio.src = window.url.pathToFileURL(path).href
  }
  function loadEnd() {
    duration.value = audio.duration
    state.value = 'pause'
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
  // 更新音乐进度，offset为是否使用偏移值
  function changeTime(time: number, offset: boolean = false) {
    audio.currentTime = time + (offset ? audio.currentTime : 0)
  }
  // 更新音乐音量，offset为是否使用偏移值
  function changeVol(vol: number, offset: boolean = false) {
    volume.value = Math.min(100, Math.max(0, vol + (offset ? volume.value : 0)))
  }
  return {
    /** 播放状态，只读 */ mscState: state,
    /** 当前音量，只读 */ mscVol: volume,
    /** 是否静音，只读 */ mscMute: mute,
    /** 音乐时长，只读 */ mscDur: duration,
    /** 音乐进度，只读 */ mscTime: curtime
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      // 仅有音量需要持久化
      { storage: localStorage, paths: ['mscVol', 'mscMute'] }
    ]
  }
})
