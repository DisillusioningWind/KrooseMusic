import { app, session, Menu } from 'electron/main'
import { join } from 'path'
import { KMusicWindow } from './modules/KMusicWindow.js'
import { initModules } from './modules/index.js'
import { ModuleManager } from './modules/KModuleManager.js'
import { KWindowControl } from './modules/KWindowControl.js'

// 设置用户数据目录
if (process.env.NODE_ENV === 'development') {
  const appPath = app.getAppPath()
  app.setPath('userData', join(appPath, 'data', 'userData'))
  app.setPath('sessionData', join(appPath, 'data', 'sessionData'))
} else {
  // 被打包后的exe文件路径
  const exePath = app.getPath('exe')
  const exeDir = exePath.substring(0, exePath.lastIndexOf('\\'))
  app.setPath('userData', join(exeDir, 'data', 'userData'))
  app.setPath('sessionData', join(exeDir, 'data', 'sessionData'))
}
// 关闭原生菜单
Menu.setApplicationMenu(null)
// 关闭非必要日志输出
app.commandLine.appendSwitch('log-level', '3')
// 初始化模块
initModules()

app.whenReady().then(() => {
  const mainWindow = new KMusicWindow()
  ModuleManager.get<KWindowControl>(KWindowControl.name).setMainWindow(mainWindow)

  if (process.env.NODE_ENV === 'development') {
    // Vue Devtools
    // session.defaultSession.loadExtension('C:/Users/WHR/AppData/Local/Microsoft/Edge/User Data/Default/Extensions/olofadcdnkkjdfgjcmjaadnlehnnihnl/6.6.3_0')
  }
})

app.on('window-all-closed', () => {
  app.quit()
})
