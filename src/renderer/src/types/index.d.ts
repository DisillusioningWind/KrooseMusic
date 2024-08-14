export global {
  interface ILyric {
    time: number
    lyric: string
    uid: string
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
