import { BrowserWindow } from 'electron/main'
import { join } from 'path'

/** 应用主窗口模块 */
export class KMusicWindow extends BrowserWindow {
  constructor() {
    const preloadFilePath = '../preload/index.mjs'
    const rendererFilePath = '../renderer/index.html'
    // 窗口配置
    super({
      width: 900,
      height: 670,
      frame: false,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, preloadFilePath),
        sandbox: false,
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: false
      }
    })
    // 加载页面
    if (process.env.NODE_ENV === 'development') {
      process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
      this.loadURL('http://localhost:5173')
    } else {
      this.loadFile(join(__dirname, rendererFilePath))
    }
    // 事件监听
    this.on('ready-to-show', () => { this.show() })
  }
}