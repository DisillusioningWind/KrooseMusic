import { logExeTimeAsync } from '@renderer/utils/tools'
import bus from '@renderer/utils/emitter'

export default class KPlayer {
  private _audio: HTMLAudioElement
  private _state: 'unload' | 'play' | 'pause' | 'stop' = 'unload'
  private _path: string = ''
  private _duration: number = 0
  private _title: string = ''
  private _artist: string = ''
  private _picURL: string = ''
  private _mainColor: string = '#1a5d8e'
  private _lyrics: ILyric[] = []
  get state() { return this._state }
  get path() { return this._path }
  get duration() { return this._duration }
  get title() { return this._title }
  get artist() { return this._artist }
  get picURL() { return this._picURL }
  get mainColor() { return this._mainColor }
  get lyrics() { return this._lyrics }
  get time() { return this._audio.currentTime }
  set time(time: number) { this._audio.currentTime = time }
  get volume() { return this._audio.volume }
  set volume(volume: number) { this._audio.volume = volume }
  // 若在构造函数中调用initialEvents和initialHandlers，会导致Vue无法监听到audio的事件
  constructor() {
    this._audio = new Audio()
  }
  @logExeTimeAsync
  async load(path: string) {
    try {
      this.pause()
      this._state = 'unload'
      this._audio.src = window.url.pathToFileURL(path).href
      // 加载歌词和音乐信息
      const lyricRes = window.ipc.invoke('getLyricFromFile', path)
      const infoRes = window.ipc.invoke('getInfoFromFile', path)
      this._lyrics = await lyricRes as ILyric[]
      const { tag, mainColor } = await infoRes as IMusicInfo
      this._path = path
      this._title = tag.title || window.path.basename(path, window.path.extname(path))
      this._artist = tag.artist || '未知艺术家'
      this._picURL = (tag.picture) ? URL.createObjectURL(new Blob([tag.picture[0].data])) : ''
      this._mainColor = mainColor
      bus.musicInfoLoadEmit()
    } catch (e) {
      console.error(e)
    }
  }
  unload() {
    URL.revokeObjectURL(this._picURL)
    this._audio.src = ''
    this._path = ''
    this._duration = 0
    this._title = ''
    this._artist = ''
    this._picURL = ''
    this._mainColor = '#1a5d8e'
    this._lyrics = []
    this._state = 'unload'
    bus.musicUnloadEmit()
  }
  loaded() {
    this._state = 'stop'
    this._duration = this._audio.duration
    this.play()
  }
  play() {
    if (this._state === 'pause' || this._state === 'stop') {
      this._audio.play()
      this._state = 'play'
    }
  }
  pause() {
    if (this._state === 'play') {
      this._audio.pause()
      this._state = 'pause'
    }
  }
  stop() {
    if (this._state === 'play' || this._state === 'pause') {
      this._audio.currentTime = 0
      this._audio.pause()
      this._state = 'stop'
    }
  }
  /** 将audio原生事件转化为emitter事件发射 */
  initEvents() {
    this._audio.ontimeupdate = () => { bus.musicUpdateCurEmit(this.time) }
    this._audio.oncanplay = () => { if (this._state === 'unload') bus.musicLoadEmit() }
    this._audio.onended = () => { bus.musicEndEmit() }
  }
  /** 初始化事件监听 */
  initHandlers() {
    bus.musicLoad(this.loaded.bind(this))
    bus.musicEnd(this.pause.bind(this))
  }
}
