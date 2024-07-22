import { ElectronAPI } from '@electron-toolkit/preload'
import { RendererProcessIpc } from 'electron-better-ipc'

declare global {
  interface Window {
    electron: ElectronAPI
    ipc: RendererProcessIpc
  }
}
