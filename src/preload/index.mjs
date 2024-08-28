import { contextBridge, ipcRenderer, shell } from 'electron'
import url from 'url'
import path from 'path'

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('ipc', ipcRenderer)
    contextBridge.exposeInMainWorld('shell', shell)
    contextBridge.exposeInMainWorld('url', url)
    contextBridge.exposeInMainWorld('path', path)
  } else {
    window.ipc = ipcRenderer
    window.shell = shell
    window.url = url
    window.path = path
  }
} catch (error) {
  console.error('preload:', error)
}
