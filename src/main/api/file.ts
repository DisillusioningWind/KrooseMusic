import { dialog, BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'
import fs from 'fs'

/**
 * 打开文件对话框，选择音频文件
 * @param window 将对话框作为模态窗口附加到父窗口
 * @returns 音频文件的buffer
 */
async function openFile(window: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    window, {
    properties: ['openFile'],
    filters: [{ name: 'Music', extensions: ['mp3', 'flac', 'wav'] }]
  })
  return (!canceled)? await fs.promises.readFile(filePaths[0]) : null
}

/**
 * 绑定ipcMain接收的信号至执行函数
 * @param window ipcMain绑定的窗口
 */
export function bindIpcMain(window: BrowserWindow) {
  // open-file
  ipcMain.answerRenderer('open-file', () => openFile(window))
}
