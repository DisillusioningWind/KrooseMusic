class DBManager {
  dbName: string = 'KrooseDB'
  db: IDBDatabase | null = null

  constructor() {
    const req = indexedDB.open(this.dbName)
    req.onsuccess = (ev) => {
      if (this.db) return
      // @ts-ignore
      this.db = ev.target.result as IDBDatabase
      console.log('数据库打开成功')
    }
    req.onupgradeneeded = (ev) => {
      // @ts-ignore
      this.db = ev.target.result as IDBDatabase
      const store = this.db.createObjectStore('Library', { keyPath: 'id', autoIncrement: true })
      store.createIndex('name', 'name', { unique: false })
      store.transaction.oncomplete = () => console.log('数据库创建成功')
    }
  }

  addDir(dir: FileSystemDirectoryHandle, mode: 'normal' | 'asmr' = 'normal') {
    return new Promise<number>((resolve, reject) => {
      if (!this.db) { reject('数据库未打开'); return; }
      const item = { name: dir.name, mode, dir }
      const res = this.db.transaction('Library', 'readwrite').objectStore('Library').add(item)
      res.onerror = () => reject(res.error)
      res.onsuccess = () => { console.log('音乐目录添加成功'); resolve(res.result as number); }
    })
  }

  getDir(key: number) {
    return new Promise<FileSystemDirectoryHandle>((resolve, reject) => {
      if (!this.db) { reject('数据库未打开'); return; }
      const res = this.db.transaction('Library', 'readonly').objectStore('Library').get(key)
      res.onerror = () => reject(res.error)
      res.onsuccess = () => resolve(res.result.dir)
    })
  }

  getAllDir() {
    return new Promise<ILibrary[]>((resolve, reject) => {
      if (!this.db) { reject('数据库未打开'); return; }
      const res = this.db.transaction('Library', 'readonly').objectStore('Library').getAll()
      res.onerror = () => reject(res.error)
      res.onsuccess = () => resolve(res.result)
    })
  }

  updateDir(key: number, mode: 'normal' | 'asmr'): Promise<void>
  updateDir(name: string, mode: 'normal' | 'asmr'): Promise<void>
  updateDir(value: string | number, mode: 'normal' | 'asmr') {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) { reject('数据库未打开'); return; }
      const store = this.db.transaction('Library', 'readwrite').objectStore('Library')
      const res = typeof value === 'number' ? store.get(value) : store.index('name').get(value)
      res.onerror = () => reject(res.error)
      res.onsuccess = () => {
        if (!res.result) { reject('音乐目录不存在'); return; }
        const item = res.result
        item.mode = mode
        const update = store.put(item)
        update.onerror = () => reject(update.error)
        update.onsuccess = () => { console.log('音乐目录更新成功'); resolve() }
      }
    })
  }

  deleteDir(key: number): Promise<void>
  deleteDir(name: string): Promise<void>
  deleteDir(value: string | number) {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) { reject('数据库未打开'); return; }
      const store = this.db.transaction('Library', 'readwrite').objectStore('Library')
      const res = typeof value === 'number' ? store.get(value) : store.index('name').get(value)
      res.onerror = () => reject(res.error)
      res.onsuccess = () => {
        if (!res.result) { reject('音乐目录不存在'); return; }
        const del = store.delete(res.result.id)
        del.onerror = () => reject(del.error)
        del.onsuccess = () => { console.log('音乐目录删除成功'); resolve() }
      }
    })
  }

  close() {
    if (!this.db) return
    this.db.close()
    this.db = null
  }
}

const dbManager = new DBManager()
export default dbManager
