import { ipcMain } from 'electron'
import { BrowserWindow } from 'electron'
import * as fileAPI from './file.js'
import * as musicAPI from './music.js'
import * as storeAPI from './store.js'
import * as windowAPI from './window.js'
import * as libraryAPI from './library.js'

/** 所有API */
const API = {
  ...fileAPI,
  ...musicAPI,
  ...storeAPI,
}

/**
 * 绑定ipcMain接收的信号至执行函数，对于需要window作为参数的API，将window作为第一个参数传入
 * @param window ipcMain绑定的窗口
 */
export function bindIpcMain(window: BrowserWindow) {
  for (const key of Object.keys(API)) {
    ipcMain.handle(key, (_e, ...args) => {
      return API[key](...args)
    })
  }
  for (const key of Object.keys(windowAPI)) {
    ipcMain.handle(key, (_e, ...args) => {
      return windowAPI[key](window, ...args)
    })
  }
  for (const key of Object.keys(libraryAPI)) {
    ipcMain.handle(key, (e, ...args) => {
      return libraryAPI[key](e, ...args)
    })
  }
}
