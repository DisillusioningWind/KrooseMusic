import { app, BrowserWindow } from 'electron/main'
import remote from '@electron/remote/main'
import { join } from 'path'

class MainWindow extends BrowserWindow {
  constructor() {
    const preloadFilePath = '../preload/index.js'
    const rendererFilePath = '../renderer/index.html'
    //窗口配置
    super({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, preloadFilePath),
        contextIsolation: false,
        nodeIntegration: true,
        sandbox: false
      }
    })
    //加载页面
    if (process.env.NODE_ENV === 'development') {
      this.loadURL('http://localhost:5173')
    } else {
      this.loadFile(join(__dirname, rendererFilePath))
    }
    //事件监听
    this.on('ready-to-show', () => {
      super.show()
    })
  }
}

app.whenReady().then(() => {
  const mainWindow = new MainWindow()
  remote.initialize()
  remote.enable(mainWindow.webContents)
})

app.on('window-all-closed', () => {
  app.quit()
})
