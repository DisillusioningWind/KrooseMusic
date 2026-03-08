import type { Shell } from 'electron'
import type { newAPI } from '../main/modules/index.ts'
import { pathToFileURL } from 'url'

declare global {
  interface Window {
    she: Shell
    api: newAPI,
    url: { pathToFileURL: typeof pathToFileURL },
  }
}
