import type { Shell } from 'electron'
import type { API } from '../main/modules/index.ts'
import { pathToFileURL } from 'url'

declare global {
  interface Window {
    she: Shell
    api: API,
    url: { pathToFileURL: typeof pathToFileURL },
  }
}
