import { FunctionalComponent, SVGAttributes } from 'vue'
import { ICommonTagsResult } from 'music-metadata'
declare global {
  interface ILyric {
    time: number
    lyric: string
    uid: string
  }
  interface IMusicInfo {
    tag: ICommonTagsResult
    mainColor: string
  }
  interface IMenuItem {
    icon?: FunctionalComponent<SVGAttributes, {}, any, {}>
    label: string
    action: () => void
  }
  interface IDirStruc {
    name: string
    musics?: { name: string, path: string }[]
    dirs?: IDirStruc[]
  }

  type LibMode = 'normal' | 'asmr'
  type ListMode = LibMode | 'playlist'
  interface ILibItem {
    name: string
    path: string
  }
  interface ILibrary extends ILibItem {
    id: number
    mode: LibMode
  }
  interface ILibMusic extends ILibItem {
    ext: string
    artist: string
    duration: number
  }
  interface ILibAlbum extends ILibItem {
    pic?: string
  }
}
