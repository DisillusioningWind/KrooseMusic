import type { API } from './ipc.gen'
import { pathToFileURL } from 'url'

declare global {
  interface Window {
    api: API,
    url: { pathToFileURL: typeof pathToFileURL },
  }
}
