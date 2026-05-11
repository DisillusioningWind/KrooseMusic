import type { API } from '../main/modules/index.ts'
import { pathToFileURL } from 'url'

declare global {
  interface Window {
    api: API,
    url: { pathToFileURL: typeof pathToFileURL },
  }
}
