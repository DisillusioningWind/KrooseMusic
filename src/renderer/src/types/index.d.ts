import { ICommonTagsResult } from 'music-metadata'
export global {
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
    icon?: string
    label: string
  }
  type LibMode = 'normal' | 'asmr'
  interface ILibrary {
    id: number
    name: string
    path: string
    mode: LibMode
  }
  interface ILibMusic {
    name: string
    path: string
    artist: string
    duration: number
    coms: ICommonTagsResult
  }
}
