import { ipcMain } from 'electron-better-ipc'
import { BrowserWindow } from 'electron'
import * as fileAPI from './file'
import * as musicAPI from './music'
import * as windowAPI from './window'

/** 所有API */
const API = {
  ...fileAPI,
  ...musicAPI
}

/**
 * 绑定ipcMain接收的信号至执行函数，对于需要window作为参数的API，将window作为第一个参数传入
 * @param window ipcMain绑定的窗口
 */
export function bindIpcMain(window: BrowserWindow) {
  for (const key of Object.keys(API)) {
    ipcMain.answerRenderer(key, async (...args) => {
      return await API[key](...args)
    })
  }
  for (const key of Object.keys(windowAPI)) {
    ipcMain.answerRenderer(key, async (...args) => {
      return await windowAPI[key](window, ...args)
    })
  }
}
