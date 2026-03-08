import { dialog, BrowserWindow } from 'electron/main'
import { KModule } from './KModule.js'

export class KWindowControl extends KModule {
  readonly namespace = 'win' as const
  private mainWindow?: BrowserWindow

  provideAPI() {
    return {
      openFileWindow: this.openFileWindow,
      openDirectoryWindow: this.openDirectoryWindow,
      minWindow: this.minWindow,
      maxWindow: this.maxWindow,
      closeWindow: this.closeWindow,
      reloadWindow: this.reloadWindow,
      openDevTools: this.openDevTools
    }
  }

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window
  }

  /**
   * 打开文件对话框，选择音乐文件
   * @param window 将对话框作为模态窗口附加到父窗口
   * @returns 选择的音乐文件路径
   */
  async openFileWindow() {
    if (!this.mainWindow) {
      return undefined
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(
      this.mainWindow,
      {
        properties: ['openFile'],
        filters: [{ name: 'Music', extensions: ['mp3', 'flac', 'wav'] }]
      }
    )
    return (!canceled) ? filePaths[0] : undefined
  }

  /**
   * 打开文件对话框，选择文件夹
   * @param window 将对话框作为模态窗口附加到父窗口
   * @returns 选择的文件夹路径
   */
  async openDirectoryWindow() {
    if (!this.mainWindow) {
      return undefined
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow, { properties: ['openDirectory'] } )
    return (!canceled) ? filePaths[0] : undefined
  }

  /** 最小化窗口 */
  minWindow() { this.mainWindow?.minimize() }

  /** 最大化/还原窗口 */
  maxWindow() { this.mainWindow?.isMaximized() ? this.mainWindow?.unmaximize() : this.mainWindow?.maximize() }

  /** 关闭窗口 */
  closeWindow() { this.mainWindow?.close() }

  /** 重载窗口 */
  reloadWindow() { this.mainWindow?.reload() }

  /** 打开开发者工具 */
  openDevTools() { this.mainWindow?.webContents.openDevTools() }
}