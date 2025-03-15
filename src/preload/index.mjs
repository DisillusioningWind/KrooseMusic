import { contextBridge, ipcRenderer, shell } from 'electron/renderer'
import url from 'url'

async function preloadAPI() {
  const api = {}
  const names = await ipcRenderer.invoke('getAPINames')
  for (const name of names) { api[name] = (...args) => { return ipcRenderer.invoke(name, ...args) } }
  return api
}

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('shell', shell)
    contextBridge.exposeInMainWorld('url', url)
    contextBridge.exposeInMainWorld('api', await preloadAPI())
  } else {
    window.shell = shell
    window.url = url
    window.api = await preloadAPI()
  }
} catch (error) {
  console.error('preload:', error)
}
