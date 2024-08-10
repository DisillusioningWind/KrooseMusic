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

const store = new Store<StoreType>()

export function setStore(key: string, value: any) {
  store.set(key, value)
}

export function getStore(key: string) {
  return store.get(key)
}
