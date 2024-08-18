import { app, BrowserWindow, session } from 'electron/main'
import { join } from 'path'
import { bindIpcMain } from './api/index.js'

class MainWindow extends BrowserWindow {
  constructor() {
    const preloadFilePath = '../preload/index.mjs'
    const rendererFilePath = '../renderer/index.html'
    //窗口配置
    super({
      width: 900,
      height: 670,
      frame: false,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, preloadFilePath),
        contextIsolation: false,
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: false
      }
    })
    //加载页面
    if (process.env.NODE_ENV === 'development') {
      process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
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

app.setPath('userData', join(app.getAppPath(), 'Data', 'userData'))
app.setPath('sessionData', join(app.getAppPath(), 'Data', 'sessionData'))
console.log('userDataDir:', app.getPath('userData'))
console.log('sessionDataDir:', app.getPath('sessionData'))

app.whenReady().then(() => {
  const mainWindow = new MainWindow()
  bindIpcMain(mainWindow)
  session.defaultSession.loadExtension('C:/Users/WHR/AppData/Local/Microsoft/Edge/User Data/Default/Extensions/olofadcdnkkjdfgjcmjaadnlehnnihnl/6.6.3_0')
})

app.on('window-all-closed', () => {
  app.quit()
})
