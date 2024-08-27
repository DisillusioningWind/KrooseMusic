import { IpcRenderer } from 'electron'
import url from 'url'
import path from 'path'

declare global {
  interface Window {
    ipc: IpcRenderer
    url: typeof url
    path: typeof path
  }
}
