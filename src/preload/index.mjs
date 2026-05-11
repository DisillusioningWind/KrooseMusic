import { contextBridge, ipcRenderer } from 'electron'
import { pathToFileURL } from 'url'

async function getAllAPI() {
  const api = {}
  const def = await ipcRenderer.invoke('getAllAPI')
  for (const [namespace, channels] of Object.entries(def)) {
    api[namespace] = {}
    for (const channel of channels) {
      api[namespace][channel] = (...args) => ipcRenderer.invoke(`${namespace}:${channel}`, ...args)
    }
  }
  return api
}

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('url', { pathToFileURL })
    contextBridge.exposeInMainWorld('api', await getAllAPI())
  } else {
    window.url = { pathToFileURL }
    window.api = await getAllAPI()
  }
} catch (error) {
  console.error('preload:', error)
}
