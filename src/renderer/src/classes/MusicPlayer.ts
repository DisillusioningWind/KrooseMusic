import type { ICommonTagsResult } from 'music-metadata'
import { ref, onMounted } from 'vue'
import { logExeTimeAsync } from '@renderer/utils/tools'
import { emitter, events } from '@renderer/utils/emitter'

class MusicPlayer {
  audio: HTMLAudioElement
  audioURL: string | null = null
  private audioState:'unload' | 'play' | 'pause' | 'stop' = 'unload'
  filePath: string | null = null
  fileSize: number | null = null
  commonTags: ICommonTagsResult | null = null
  title: string | null = null
  artist: string = ''
  pictureURL: string | null = null
  mainColor: string = '#1a5d8e'
  totalTime: number = 0
  lyrics: ILyric[] = []
  resetEvent: Event
  get playerState () {
    return this.audioState
  }
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

  unload() {
    this.audio.src = ''
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
    this.lyrics = []
    this.audioState = 'unload'
    emitter.emit(events.musicReset)
  }

  @logExeTimeAsync
  async load(filePath: string) {
    if (this.audioState !== 'unload') {
      this.unload()
    }
    // 读取音乐文件
    const res = await window.ipc.callMain('loadFile', filePath) as { buffer?: Buffer, commonTags?: ICommonTagsResult, mainColor?: string, success: boolean }
    if (res.success) {
      this.commonTags = res.commonTags!
      this.artist = res.commonTags!.artist || '未知艺术家'
      this.title = res.commonTags!.title || filePath.slice(filePath.lastIndexOf('\\') + 1)
      this.mainColor = res.mainColor!
      this.pictureURL = (res.commonTags!.picture) ? URL.createObjectURL(new Blob([res.commonTags!.picture[0].data])) : null
      this.audioURL = URL.createObjectURL(new Blob([res.buffer!]))
      this.audio.src = this.audioURL
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
      this.audio.currentTime = 0
      this.audio.pause()
      this.audioState = 'stop'
    }
  }

  /** 将audio原生事件转化为emitter事件发射 */
  initialEvents() {
    this.audio.ontimeupdate = () => { emitter.emit(events.musicUpdateCur, this.currentTime) }
    this.audio.oncanplay = () => { emitter.emit(events.musicCanPlay) }
    this.audio.onended = () => { emitter.emit(events.musicEnd) }
  }

  /** 初始化事件监听 */
  initialHandlers() {
    emitter.on(events.musicCanPlay, this.readyPlay.bind(this))
  }
}

export function useMusicPlayer() {
  const musicPlayer = ref(new MusicPlayer())
  //由Vue来接管事件绑定，否则无法监听到数据变化
  onMounted(() => {
    musicPlayer.value.initialEvents()
    musicPlayer.value.initialHandlers()
  })
  return musicPlayer
}
