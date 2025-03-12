// Description: 软件窗口相关的API
import { dialog, BrowserWindow } from 'electron/main'

/**
 * 打开文件对话框，选择音乐文件
 * @param window 将对话框作为模态窗口附加到父窗口，?作为渲染进程调用时无需参数的提示
 * @returns 选择的音乐文件路径
 */
export async function openFileWindow(window?: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    window!, {
      properties: ['openFile'],
      filters: [{ name: 'Music', extensions: ['mp3', 'flac', 'wav'] }]
    }
  )
  return (!canceled) ? filePaths[0] : null
}
/**
 * 打开文件对话框，选择文件夹
 * @param window 将对话框作为模态窗口附加到父窗口，?作为渲染进程调用时无需参数的提示
 * @returns 选择的文件夹路径
 */
export async function openDirectoryWindow(window?: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(window!, { properties: ['openDirectory'] } )
  return (!canceled) ? filePaths[0] : null
}
/** 最小化窗口 */
export function minWindow(window?: BrowserWindow) { window!.minimize() }
/** 最大化/还原窗口 */
export function maxWindow(window?: BrowserWindow) { window!.isMaximized() ? window!.unmaximize() : window!.maximize() }
/** 关闭窗口 */
export function closeWindow(window?: BrowserWindow) { window!.close() }
/** 重载窗口 */
export function reloadWindow(window?: BrowserWindow) { window!.reload() }
/** 打开开发者工具 */
export function openDevTools(window?: BrowserWindow) { window!.webContents.openDevTools() }
