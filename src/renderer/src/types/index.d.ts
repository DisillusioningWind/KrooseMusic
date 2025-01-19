import { FunctionalComponent, SVGAttributes } from 'vue'
import { ICommonTagsResult } from 'music-metadata'
declare global {
  type LibMode = 'normal' | 'asmr'
  type ListMode = LibMode | 'playlist'
  type AudioState = 'unload' | 'loading' | 'play' | 'pause' | 'stop'
  /** 循环模式 @property listOnce 列表单次 @property listLoop 列表循环 @property singleLoop 单曲循环 @property random 随机播放 */
  type LoopMode = 'listOnce' | 'listLoop' | 'singleLoop' | 'random'
  /** 菜单项 @member icon 图标 @member label 标签 @member action 动作 */
  interface IMenuItem {
    icon?: FunctionalComponent<SVGAttributes, {}, any, {}>
    label: string
    action: () => void
  }
  /** 音乐歌词 @member time 时间戳 @member lyric 歌词内容 @member uid 歌词唯一标识 */
  interface ILyric {
    time: number
    lyric: string
    uid: string
  }
  /** 音乐信息 @member tag 音乐标签 @member mainColor 音乐主色调 */
  interface IMusicInfo {
    tag: ICommonTagsResult
    mainColor: string
  }
  /** 目录结构 @member name 目录名 @member musics 音乐列表 @member dirs 子目录 */
  interface IDirStruc {
    name: string
    musics?: { name: string, path: string }[]
    dirs?: IDirStruc[]
  }
  /** 曲库项目 @member name 项目名 @member path 项目路径 */
  interface ILibItem {
    name: string
    path: string
  }
  /** 曲库 @member id 项目id @member mode 项目模式 */
  interface ILibrary extends ILibItem {
    id: number
    mode: LibMode
  }
  /** 普通曲库项目 @member ext 文件后缀 @member artist 艺术家 @member duration 时长 */
  interface ILibMusic extends ILibItem {
    ext: string
    artist: string
    duration: number
  }
  /** 专辑曲库项目 @member pic 专辑封面 */
  interface ILibAlbum extends ILibItem {
    pic: string
  }
}
