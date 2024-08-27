import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'
import url from 'url'
import path from 'path'

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('ipc', ipcRenderer)
    contextBridge.exposeInMainWorld('url', url)
    contextBridge.exposeInMainWorld('path', path)
  } else {
    window.ipc = ipcRenderer
    window.url = url
    window.path = path
  }
} catch (error) {
  console.error('preload:', error)
}
