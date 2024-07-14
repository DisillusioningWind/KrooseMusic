import type { ICommonTagsResult, IPicture } from 'music-metadata'
import type { RendererProcessIpc } from 'electron-better-ipc'

export class MusicPlayer {
  ipc: RendererProcessIpc
  audio: HTMLAudioElement
  audioURL: string | null = null
  audioState:'unload' | 'play' | 'pause' | 'stop' = 'unload'
  filePath: string | null = null
  fileSize: number | null = null
  commonTags: ICommonTagsResult | null = null
  picture: IPicture | null = null
  pictureURL: string | null = null
  mainColor: string = '#1a5d8e'
  get totalTime() {
    return this.audio.duration
  }
  get currentTime() {
    return this.audio.currentTime
  }

  constructor() {
    this.audio = new Audio()
    // @ts-ignore
    this.ipc = window.ipc
  }

  reset() {
    this.filePath = null
    this.fileSize = null
    this.commonTags = null
    this.picture = null
    URL.revokeObjectURL(this.audioURL as string)
    URL.revokeObjectURL(this.pictureURL as string)
    this.audioURL = null
    this.pictureURL = null
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
    if (this.commonTags.picture) {
      this.picture = this.commonTags.picture[0]
      this.pictureURL = URL.createObjectURL(new Blob([this.picture.data]))
      this.mainColor = await this.ipc.callMain('getMainColorFromBuffer', this.picture.data)
    }
  }
}
