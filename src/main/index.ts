import { app, BrowserWindow, session } from 'electron/main'
import { join } from 'path'
import { registerAPI } from './api/index.js'

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

//设置用户数据目录
if (process.env.NODE_ENV === 'development') {
  const appPath = app.getAppPath()
  app.setPath('userData', join(appPath, 'data', 'userData'))
  app.setPath('sessionData', join(appPath, 'data', 'sessionData'))
  console.log('userDataDir: ', app.getPath('userData'))
  console.log('sessDataDir: ', app.getPath('sessionData'))
} else {
  //被打包后的exe文件路径
  const exePath = app.getPath('exe')
  const exeDir = exePath.substring(0, exePath.lastIndexOf('\\'))
  app.setPath('userData', join(exeDir, 'data', 'userData'))
  app.setPath('sessionData', join(exeDir, 'data', 'sessionData'))
}

app.whenReady().then(() => {
  const mainWindow = new MainWindow()
  registerAPI(mainWindow)
  //打包时注意删除
  if (process.env.NODE_ENV === 'development') {
    //Vue Devtools
    session.defaultSession.loadExtension('C:/Users/WHR/AppData/Local/Microsoft/Edge/User Data/Default/Extensions/olofadcdnkkjdfgjcmjaadnlehnnihnl/6.6.3_0')
  }
})

app.on('window-all-closed', () => {
  app.quit()
})
