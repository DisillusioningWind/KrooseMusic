import { IpcRenderer, Shell } from 'electron'
import url from 'url'
import path from 'path'

declare global {
  interface Window {
    ipc: IpcRenderer
    shell: Shell
    url: typeof url
    path: typeof path
  }
}
