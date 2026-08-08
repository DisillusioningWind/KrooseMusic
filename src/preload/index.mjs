import { contextBridge } from 'electron'
import { pathToFileURL } from 'url'
import { api } from './ipc.gen.mjs'

try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('url', { pathToFileURL })
    contextBridge.exposeInMainWorld('api', api)
  } else {
    window.url = { pathToFileURL }
    window.api = api
  }
} catch (error) {
  console.error('preload:', error)
}
