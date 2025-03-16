import { FunctionalComponent, SVGAttributes } from 'vue'
import { ICommonTagsResult } from 'music-metadata'
declare global {
  type LibMode = 'normal' | 'asmr'
  type ListMode = LibMode | 'playlist'
  type AudioState = 'unload' | 'loading' | 'play' | 'pause'
  enum LoopMode { listOnce, listLoop, singLoop, randLoop }
  /** 菜单项 */
  interface IMenuItem {
    /** 图标 */ icon?: FunctionalComponent<SVGAttributes, {}, any, {}>
    /** 标签 */ label: string
    /** 动作 */ action: () => void
  }
  /** 音乐歌词 */
  interface ILyric {
    /** 时间 */ time: number
    /** 歌词 */ lyric: string
  }
  /** 音乐信息 */
  interface IMusicInfo {
    /** 标签 */ tag: ICommonTagsResult
    /** 主色 */ mainColor: string
  }
  /** 目录结构 */
  interface IDir {
    /** 目录名称 */ name: string
    /** 子目录表 */ dirs: IDir[]
    /** 音乐列表 */ mscs: ILibItem[]
  }
  /** 曲库项目 */
  interface ILibItem {
    /** 名称 */ name: string
    /** 路径 */ path: string
  }
  /** 曲库 */
  interface ILibrary extends ILibItem {
    /** 标识 */ id: number
    /** 模式 */ mode: LibMode
  }
  /** 音乐曲库项目 */
  interface ILibMusic extends ILibItem {
    /** 文件后缀 */ ext: string
    /** 艺术家 */ artist: string
    /** 时长 */ duration: number
  }
  /** 专辑曲库项目 */
  interface ILibAlbum extends ILibItem {
    /** 封面路径 */ pic: string
  }
}
