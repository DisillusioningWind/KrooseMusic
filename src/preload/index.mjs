import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron-better-ipc'

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('ipc', ipcRenderer)
  } else {
    window.electron = electronAPI
    window.ipc = ipcRenderer
  }
} catch (error) {
  console.error('preload:', error)
}
