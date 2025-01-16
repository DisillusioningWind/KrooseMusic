import { ipcMain, BrowserWindow } from 'electron/main'
import * as windowAPI from './window.js'
import * as settingAPI from './setting.js'
import * as musicDirAPI from './musicDir.js'
import * as musicInfoAPI from './musicInfo.js'
import * as databaseAPI from './database.js'

const normalAPI = {
  ...settingAPI,
  ...musicDirAPI,
  ...musicInfoAPI,
  ...databaseAPI,
}
const API = {
  ...normalAPI,
  ...windowAPI,
}
/** 所有API的类型 */
export type API = typeof API
/** 注册ipcMain的API @param window API绑定的窗口 */
export function registerAPI(window: BrowserWindow) {
  ipcMain.handle('getAPINames', () => { return Object.keys(API) })
  for (const key of Object.keys(normalAPI)) { ipcMain.handle(key, (_, ...args) => { return normalAPI[key](...args) }) }
  for (const key of Object.keys(windowAPI)) { ipcMain.handle(key, (_, ...args) => { return windowAPI[key](window, ...args) }) }
}
