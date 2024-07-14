import { ipcMain } from 'electron-better-ipc'
import { BrowserWindow } from 'electron'
import * as fileAPI from './file'
import * as musicAPI from './music'

/** 所有API */
const allAPI = {
  ...fileAPI,
  ...musicAPI
}

/**
 * 绑定ipcMain接收的信号至执行函数，对于需要window作为参数的API，将window作为第一个参数传入
 * @param window ipcMain绑定的窗口
 */
export function bindIpcMain(window: BrowserWindow) {
  const { windowAPI, ...api } = allAPI
  for (const key of Object.keys(api)) {
    ipcMain.answerRenderer(key, async (...args) => {
      return windowAPI.includes(key) ? api[key](window, ...args) : api[key](...args)
    })
  }
}
