import { dialog, BrowserWindow } from 'electron'
import fs from 'fs'

/** 需要window作为参数的API名称 */
export const windowAPI = [
  'openFileWindow'
]

/**
 * 打开文件对话框，选择音频文件
 * @param window 将对话框作为模态窗口附加到父窗口
 * @returns 选择的音频文件路径
 */
export async function openFileWindow(window: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    window, {
    properties: ['openFile'],
    filters: [{ name: 'Music', extensions: ['mp3', 'flac', 'wav'] }]
  })
  return (!canceled) ? filePaths[0] : null
}

/**
 * 读取文件内容
 * @param path 文件路径
 * @returns 文件内容和大小
 */
export function loadFile(path: string) {
  const size = fs.statSync(path).size
  const buffer = Buffer.alloc(size)
  fs.readSync(fs.openSync(path, 'r'), buffer, 0, size, 0)
  return { buffer, size }
}
