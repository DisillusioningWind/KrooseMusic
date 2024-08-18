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
  interface ILibrary {
    id: number
    name: string
    mode: 'normal' | 'asmr'
    dir: FileSystemDirectoryHandle
  }
}
