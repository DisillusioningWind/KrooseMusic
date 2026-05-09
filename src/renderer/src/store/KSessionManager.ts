import { defineStore } from 'pinia'
import { LoopMode } from '@renderer/types/Enum'
import { bus, Events } from '@renderer/utils/EventUtil'
import { getAudioManager } from '@renderer/store/KAudioManager'

/** 播放会话管理 */
export const getSessionManager = defineStore('store-session', () => {
  const loopMode = ref<LoopMode>(LoopMode.listOnce) // 循环模式
  const playQueue = shallowRef<ILibItem[]>([]) // 播放队列
  const playMusic = ref<ILibItem>() // 当前播放音乐
  const playAlbum = ref<ILibAlbum>() // 当前播放专辑

  bus.on(Events.musicLoaded, updatePlayMusic)
  bus.on(Events.musicFinish, loopPlayQueue)
  onMounted(() => {
    resumePlayMusic()
  })

  /** 更新当前播放队列 */
  function updatePlayQueue(queue: ILibItem[]) {
    playQueue.value = queue
  }
  /** 处理音乐循环 @param next 是否播放下/上一首 @param end 是否当前音乐自然结束 */
  function loopPlayQueue(next: boolean = true, end: boolean = true) {
    const audioManager = getAudioManager()
    const playIdex = playQueue.value.findIndex(item => item.path === playMusic.value?.path) // 正在播放音乐索引
    let loadIdex = -1 // 加载音乐索引
    let loadPath = '' // 加载音乐路径
    let loadMode = false // 加载音乐是否自动播放

    if (playIdex === -1) {
      console.error(`loop failed: cannot find playMusic, playMusic.path=${playMusic.value?.path}`)
      return
    }

    if (loopMode.value === LoopMode.randLoop) {
      // 加载随机音乐：循环模式为随机播放
      const randIdex = Math.floor(Math.random() * (playQueue.value.length - 1))
      loadIdex = playIdex <= randIdex ? randIdex + 1 : randIdex
    } else if (next && end && loopMode.value === LoopMode.singLoop) {
      // 加载当前音乐：播放下一首，且当前音乐自然结束，且循环模式为单曲循环
      loadIdex = playIdex
    } else if (next && (!end || loopMode.value !== LoopMode.singLoop)) {
      // 加载下一首：播放下一首，且（循环模式不为单曲循环，或当前音乐非自然结束）
      loadIdex = playIdex === playQueue.value.length - 1 ? 0 : playIdex + 1
    } else if (!next) {
      // 加载上一首: 播放上一首
      loadIdex = playIdex === 0 ? playQueue.value.length - 1 : playIdex - 1
    }

    // 音乐自然结束时：循环模式为列表单次且加载音乐为列表第一首时不自动播放，其余情况自动播放
    // 音乐非自然结束时：音乐播放状态为播放时自动播放，否则不自动播放，此处全部设置为不自动播放
    loadMode = end ? (loopMode.value === LoopMode.listOnce ? loadIdex !== 0 : true) : audioManager.mscState === 'play'
    loadPath = playQueue.value[loadIdex].path

    audioManager.load(loadPath, loadMode)
  }
  /** 更新当前播放音乐 */
  function updatePlayMusic(path: string) {
    const playIdex = playQueue.value.findIndex(item => item.path === path)

    if (playIdex === -1) {
      console.error(`updatePlayMusic failed: cannot find playMusic, playMusic.path=${path}`)
      return
    }

    playMusic.value = playQueue.value[playIdex]
  }
  /** 从上次会话中恢复最后播放音乐 */
  function resumePlayMusic() {
    const audioManager = getAudioManager()
    const playMusicPath = playMusic.value?.path
    playMusicPath && audioManager.load(playMusicPath, false)
  }
  /** 更新当前播放专辑 */
  function updatePlayAlbum(album: ILibAlbum) {
    playAlbum.value = album
  }

  return {
    /** 循环模式 */
    loopMode,
    /** 播放队列 */
    playQueue,
    /** 当前播放音乐 */
    playMusic,
    /** 当前播放专辑 */
    playAlbum,
    /** 更新播放队列 */
    updatePlayQueue,
    /** 处理音乐循环 @param next 是否播放下/上一首 @param end 是否当前音乐自然结束 */
    loopPlayQueue,
    /** 更新当前播放专辑 */
    updatePlayAlbum,
  }
}, {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['loopMode', 'playMusic', 'playAlbum'] }]
  }
})