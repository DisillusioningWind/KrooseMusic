import { defineStore } from 'pinia'
import { bus, Events } from '@renderer/utils/EventUtil'

/** 音乐播放控制 */
export const useAudioStore = defineStore('store-audio', () => {
  const audio = new Audio()
  const mscPath = ref('')
  const mscStat = ref<AudioState>('unload') // 播放状态
  const mscAuto = ref(true) // 是否自动播放
  const mscMute = ref(false) // 是否静音
  const mscVolu = ref(100) // 音量
  const mscDura = ref(0) // 时长
  const mscTime = ref(0) // 当前进度
  // 事件监听
  audio.oncanplay = () => {
    if (mscStat.value === 'loading') {
      loadEnd()
      bus.emit(Events.musicLoaded, mscPath.value)
    }
  }
  audio.onended = () => {
    mscStat.value = 'pause'
    bus.emit(Events.musicFinish)
  }
  audio.ontimeupdate = () => {
    mscTime.value = audio.currentTime
    bus.emit(Events.musicUpdate, audio.currentTime)
  }
  watch(mscStat, stat => {
    bus.emit(Events.musicStatChange, stat)
    if (stat === 'unload') {
      bus.emit(Events.musicUnload, mscPath.value)
    }
  })
  watch(mscDura, dura => {
    bus.emit(Events.musicDuraChange, dura)
  })
  watch([mscVolu, mscMute], ([vol, mute]) => {
    audio.volume = mute ? 0 : vol * 0.01
  })
  // 音乐控制
  function load(path: string, auto: boolean = true) {
    // 播放状态为播放时，无论此次加载为切歌还是点击，均自动播放，忽略auto参数
    // 播放状态为暂停/停止/未加载时，是否自动播放取决于auto参数
    mscAuto.value = mscStat.value === 'play' ? true : auto
    mscStat.value = 'loading'
    mscPath.value = path
    audio.src = window.url.pathToFileURL(path).href
  }
  function loadEnd() {
    mscDura.value = audio.duration
    mscStat.value = 'pause'
    if (!mscAuto.value) return
    play()
  }
  function unload() {
    audio.src = ''
    mscDura.value = 0
    mscStat.value = 'unload'
    mscPath.value = ''
  }
  function play() {
    if (mscStat.value !== 'pause') return
    audio.play()
    mscStat.value = 'play'
  }
  function pause() {
    if (mscStat.value !== 'play') return
    audio.pause()
    mscStat.value = 'pause'
  }
  // 转换为播放或暂停状态
  function changeStat() {
    switch (mscStat.value) {
      case 'play': pause(); break
      case 'pause': play(); break
    }
  }
  // 更新音乐进度，offset为是否使用偏移值
  function changeTime(time: number, offset: boolean = false) {
    audio.currentTime = time + (offset ? audio.currentTime : 0)
  }
  // 更新音乐音量，offset为是否使用偏移值
  function changeVolu(vol: number, offset: boolean = false) {
    mscVolu.value = Math.min(100, Math.max(0, vol + (offset ? mscVolu.value : 0)))
  }
  function changeMute() {
    mscMute.value = !mscMute.value
  }
  return {
    /** 播放状态 */ mscState: mscStat,
    /** 当前音量 */ mscVol: mscVolu,
    /** 是否静音 */ mscMute: mscMute,
    /** 音乐时长 */ mscDur: mscDura,
    /** 音乐进度 */ mscTime: mscTime,
    load,
    unload,
    play,
    pause,
    changeStat,
    changeTime,
    changeVolu,
    changeMute
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
