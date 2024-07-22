import type { ICommonTagsResult } from 'music-metadata'
import { ref, onMounted } from 'vue'
import { logExeTimeAsync } from '@renderer/utils/tools'

class MusicPlayer {
  audio: HTMLAudioElement
  audioURL: string | null = null
  audioState:'unload' | 'play' | 'pause' | 'stop' = 'unload'
  filePath: string | null = null
  fileSize: number | null = null
  commonTags: ICommonTagsResult | null = null
  title: string | null = null
  artist: string = ''
  pictureURL: string | null = null
  mainColor: string = '#1a5d8e'
  totalTime: number = 0
  resetEvent: Event
  get currentTime() {
    return this.audio.currentTime
  }
  set currentTime(time: number) {
    this.audio.currentTime = time
  }

  constructor() {
    this.audio = new Audio()
    this.resetEvent = new Event('reset')
  }

  reset() {
    this.filePath = null
    this.fileSize = null
    this.commonTags = null
    this.title = null
    this.artist = ''
    URL.revokeObjectURL(this.audioURL as string)
    URL.revokeObjectURL(this.pictureURL as string)
    this.audioURL = null
    this.pictureURL = null
    this.mainColor = '#1a5d8e'
    this.totalTime = 0
    this.audioState = 'unload'
    this.audio.dispatchEvent(this.resetEvent)
  }

  @logExeTimeAsync
  async load(filePath: string) {
    this.reset()
    // 读取音乐文件
    const { buffer, commonTags, mainColor } = await window.ipc.callMain('loadFileAndTag', filePath) as { buffer: Buffer, commonTags: ICommonTagsResult, mainColor: string }
    this.commonTags = commonTags
    this.artist = commonTags.artist || '未知艺术家'
    this.title = commonTags.title || filePath.slice(filePath.lastIndexOf('\\') + 1)
    this.mainColor = mainColor
    this.pictureURL = (commonTags.picture) ? URL.createObjectURL(new Blob([commonTags.picture[0].data])) : null
    this.audioURL = URL.createObjectURL(new Blob([buffer]))
    this.audio.src = this.audioURL
  }

  readyPlay() {
    if (this.audioState === 'unload') {
      this.audioState = 'stop'
      this.totalTime = this.audio.duration
      this.play()
    }
  }

  play() {
    if (this.audioState === 'pause' || this.audioState === 'stop') {
      this.audio.play()
      this.audioState = 'play'
    }
  }

  pause() {
    if (this.audioState === 'play') {
      this.audio.pause()
      this.audioState = 'pause'
    }
  }

  stop() {
    if (this.audioState === 'play' || this.audioState === 'pause') {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audioState = 'stop'
    }
  }

  onTimeUpdate(callback: (e: Event) => any) {
    this.audio.ontimeupdate = callback
  }

  onCanPlay(callback: (e: Event) => any) {
    this.audio.oncanplay = callback
  }

  onReset(callback: (e: Event) => any) {
    this.audio.addEventListener('reset', callback)
  }
}

export function useMusicPlayer() {
  const musicPlayer = ref(new MusicPlayer())
  //由Vue来接管事件绑定，否则无法监听到数据变化
  onMounted(() => {
    musicPlayer.value.onCanPlay(musicPlayer.value.readyPlay.bind(musicPlayer.value))
  })
  return musicPlayer
}
