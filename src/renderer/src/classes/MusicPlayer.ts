import { ref } from 'vue'
import { logExeTimeAsync } from '@renderer/utils/tools'
import { bus } from '@renderer/utils/emitter'

class MusicPlayer {
  audio: HTMLAudioElement
  title: string = ''
  artist: string = ''
  picURL: string = ''
  mainColor: string = '#1a5d8e'
  totalTime: number = 0
  lyrics: ILyric[] = []
  private state: 'unload' | 'play' | 'pause' | 'stop' = 'unload'
  get playerState() { return this.state }
  get currentTime() { return this.audio.currentTime }
  set currentTime(time: number) { this.audio.currentTime = time }

  constructor() {
    this.audio = new Audio()
  }

  unload() {
    URL.revokeObjectURL(this.picURL)
    this.picURL = ''
    this.audio.src = ''
    this.title = ''
    this.artist = ''
    this.mainColor = '#1a5d8e'
    this.totalTime = 0
    this.lyrics = []
    this.state = 'unload'
    bus.musicUnloadEmit()
  }

  @logExeTimeAsync
  async load(path: string) {
    try {
      this.pause()
      const oldPicURL = this.picURL
      console.log(path)
      const lyricRes = window.ipc.callMain('getLyricFromFile', path)
      const infoRes = window.ipc.callMain('getInfoFromFile', path)
      this.lyrics = await lyricRes as ILyric[]
      const { tag, mainColor } = await infoRes as IMusicInfo
      this.artist = tag.artist || '未知艺术家'
      this.title = tag.title || window.path.basename(path, window.path.extname(path))
      this.picURL = (tag.picture) ? URL.createObjectURL(new Blob([tag.picture[0].data])) : ''
      this.mainColor = mainColor
      this.audio.src = window.url.pathToFileURL(path).href
      URL.revokeObjectURL(oldPicURL)
    } catch (e) {
      console.error(e)
    }
  }

  readyPlay() {
    this.state = 'stop'
    this.totalTime = this.audio.duration
    this.play()
  }

  play() {
    if (this.state === 'pause' || this.state === 'stop') {
      this.audio.play()
      this.state = 'play'
    }
  }

  pause() {
    if (this.state === 'play') {
      this.audio.pause()
      this.state = 'pause'
    }
  }

  stop() {
    if (this.state === 'play' || this.state === 'pause') {
      this.audio.currentTime = 0
      this.audio.pause()
      this.state = 'stop'
    }
  }

  /** 将audio原生事件转化为emitter事件发射 */
  initialEvents() {
    this.audio.ontimeupdate = () => { bus.musicUpdateCurEmit(this.currentTime) }
    this.audio.oncanplay = () => { bus.musicCanPlayEmit() }
    this.audio.onended = () => { bus.musicEndEmit() }
  }

  /** 初始化事件监听 */
  initialHandlers() {
    bus.musicCanPlay(this.readyPlay.bind(this))
  }
}

const musicPlayer = ref(new MusicPlayer())
// 若在构造函数中调用initialEvents和initialHandlers，会导致Vue无法监听到audio的事件
musicPlayer.value.initialEvents()
musicPlayer.value.initialHandlers()
export default musicPlayer
