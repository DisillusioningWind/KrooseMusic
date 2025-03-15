import { Shell } from 'electron'
import type { API } from '../main/api/index'
import url from 'url'

declare global {
  interface Window {
    shell: Shell
    url: typeof url
    api: API
  }
}
