import { Shell } from 'electron'
import { API } from '../main/api/index'
import url from 'url'
import path from 'path'

declare global {
  interface Window {
    shell: Shell
    url: typeof url
    path: typeof path
    api: API
  }
}
