import { dialog, BrowserWindow } from 'electron/main'
import { KModule } from './KModule.js'
import { IPC } from '../utils/ipc.js'
import { KMusicWindow } from './KMusicWindow.js'

export class KWindowManager extends KModule {
  readonly namespace = 'win' as const
  private mainWindow?: BrowserWindow

  override onReady(): void {
    this.mainWindow = new KMusicWindow()
  }

  /**
   * 打开文件对话框，选择音乐文件
   * @param window 将对话框作为模态窗口附加到父窗口
   * @returns 选择的音乐文件路径
   */
  @IPC()
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
  @IPC()
  async openDirectoryWindow() {
    if (!this.mainWindow) {
      return undefined
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow, { properties: ['openDirectory'] } )
    return (!canceled) ? filePaths[0] : undefined
  }

  /** 最小化窗口 */
  @IPC()
  minWindow() { this.mainWindow?.minimize() }

  /** 最大化/还原窗口 */
  @IPC()
  maxWindow() { this.mainWindow?.isMaximized() ? this.mainWindow?.unmaximize() : this.mainWindow?.maximize() }

  /** 关闭窗口 */
  @IPC()
  closeWindow() { this.mainWindow?.close() }

  /** 重载窗口 */
  @IPC()
  reloadWindow() { this.mainWindow?.reload() }

  /** 打开开发者工具 */
  @IPC()
  openDevTools() { this.mainWindow?.webContents.openDevTools() }

  /**
   * 向渲染进程发送事件（供模块发送事件，通道即事件名，全项目唯一）
   * @param msg 事件消息：channel 为事件名（需在模块 Events 接口中声明），data 为事件数据
   */
  sendToRenderer<EV extends { [K in keyof EV]: (...args: any[]) => void }>(msg: { [E in keyof EV & string]: { channel: E, data: Parameters<EV[E]> } }[keyof EV & string]): void {
    this.mainWindow?.webContents.send(msg.channel, ...msg.data)
  }
}