import type { Shell } from 'electron'
import type { API } from '../main/api/index'
import { pathToFileURL } from 'url'

declare global {
  interface Window {
    she: Shell
    api: API
    url: { pathToFileURL: typeof pathToFileURL }
  }
}
