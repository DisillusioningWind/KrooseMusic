import { RendererProcessIpc } from 'electron-better-ipc'
import url from 'url'
import path from 'path'

declare global {
  interface Window {
    ipc: RendererProcessIpc
    url: typeof url
    path: typeof path
  }
}
