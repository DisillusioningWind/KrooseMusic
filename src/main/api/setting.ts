// Description: 软件设置相关的API
import Store from 'electron-store'

type StoreType = {
  app: {
    width: number,
    height: number
  }
  user: {
    isMusicBarDefault: boolean
  }
}
const setting = new Store<StoreType>()
// TODO: 添加更多设置项
export function getSetting() { console.log(setting) }
