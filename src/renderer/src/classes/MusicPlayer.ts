import type { ICommonTagsResult, IPicture } from 'music-metadata'
import type { RendererProcessIpc } from 'electron-better-ipc'
import { ref, onMounted, onUnmounted } from 'vue'

class MusicPlayer {
  ipc: RendererProcessIpc
  audio: HTMLAudioElement
  audioURL: string | null = null
  audioState:'unload' | 'play' | 'pause' | 'stop' = 'unload'
  filePath: string | null = null
  fileSize: number | null = null
  commonTags: ICommonTagsResult | null = null
  title: string | null = null
  artist: string = ''
  picture: IPicture | null = null
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
    // @ts-ignore
    this.ipc = window.ipc
  }

  reset() {
    this.filePath = null
    this.fileSize = null
    this.commonTags = null
    this.title = null
    this.artist = ''
    this.picture = null
    URL.revokeObjectURL(this.audioURL as string)
    URL.revokeObjectURL(this.pictureURL as string)
    this.audioURL = null
    this.pictureURL = null
    this.mainColor = '#1a5d8e'
    this.audioState = 'unload'
    this.totalTime = 0
    this.audio.dispatchEvent(this.resetEvent)
  }

  async load(filePath: string) {
    this.reset()
    // 读取音乐文件
    // @ts-ignore
    const { buffer, size } = await this.ipc.callMain('loadFile', filePath)
    this.filePath = filePath
    this.fileSize = size
    // 加载音频
    this.audioURL = URL.createObjectURL(new Blob([buffer]))
    this.audio.src = this.audioURL
    // 加载音乐信息，包括标签和图片
    this.commonTags! = await this.ipc.callMain('loadMusicTagsFromBuffer', buffer)
    this.title = this.commonTags.title || filePath.slice(filePath.lastIndexOf('\\') + 1)
    this.artist = this.commonTags.artist || '未知艺术家'
    if (this.commonTags.picture) {
      this.picture = this.commonTags.picture[0]
      this.pictureURL = URL.createObjectURL(new Blob([this.picture.data]))
      this.mainColor = await this.ipc.callMain('getMainColorFromBuffer', this.picture.data)
    }
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

  onTimeUpdate(callback: () => void) {
    this.audio.ontimeupdate = () => callback()
  }

  onCanPlay(callback: () => void) {
    this.audio.oncanplay = () => callback()
  }

  onReset(callback: () => void) {
    this.audio.addEventListener('reset', () => callback())
  }
}

export function useMusicPlayer() {
  const musicPlayer = ref(new MusicPlayer())

  onMounted(() => {
    musicPlayer.value.onCanPlay(musicPlayer.value.readyPlay.bind(musicPlayer.value))
  })
  return musicPlayer
}
