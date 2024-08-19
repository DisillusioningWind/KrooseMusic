import { dialog, BrowserWindow } from 'electron'

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
 * 打开文件对话框，选择文件夹
 * @param window 将对话框作为模态窗口附加到父窗口
 * @returns 选择的文件夹路径
 */
export async function openDirectoryWindow(window: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    window, {
    properties: ['openDirectory']
  })
  return (!canceled) ? filePaths[0] : null
}

export function minWindow(window: BrowserWindow) {
  window.minimize()
}

export function maxWindow(window: BrowserWindow) {
  window.isMaximized() ? window.unmaximize() : window.maximize()
}

export function closeWindow(window: BrowserWindow) {
  window.close()
}
