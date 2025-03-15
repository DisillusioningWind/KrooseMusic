import { contextBridge, ipcRenderer, shell } from 'electron'
import { pathToFileURL } from 'url'

async function preloadAPI() {
  const api = {}
  const names = await ipcRenderer.invoke('getAPINames')
  for (const name of names) { api[name] = (...args) => { return ipcRenderer.invoke(name, ...args) } }
  return api
}

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('she', shell)
    contextBridge.exposeInMainWorld('url', { pathToFileURL })
    contextBridge.exposeInMainWorld('api', await preloadAPI())
  } else {
    window.she = shell
    window.url = { pathToFileURL }
    window.api = await preloadAPI()
  }
} catch (error) {
  console.error('preload:', error)
}
