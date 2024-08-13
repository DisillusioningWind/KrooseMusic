const dbName = 'KrooseDB'
let db: IDBDatabase | null = null
const req = indexedDB.open(dbName)
req.onsuccess = (ev) => {
  if (db) return
  // @ts-ignore
  db = ev.target.result as IDBDatabase
  console.log('数据库打开成功')
}
req.onupgradeneeded = (ev) => {
  // @ts-ignore
  db = ev.target.result as IDBDatabase
  const store = db.createObjectStore('Library', { autoIncrement: true })
  store.createIndex('name', 'name', { unique: false })
  store.transaction.oncomplete = () => {
    console.log('数据库创建成功')
  }
}

export function DBAddDir(dir: FileSystemDirectoryHandle) {
  if (db) {
    const res = db.transaction('Library', 'readwrite').objectStore('Library').add({ name: dir.name, dir })
    res.onsuccess = () => console.log('音乐目录添加成功')
    res.onerror = () => console.log('音乐目录添加失败')
  } else {
    console.log('数据库未打开')
  }
}

export function DBGetDir(key: number) {
  return new Promise<FileSystemDirectoryHandle>((resolve, reject) => {
    if (db) {
      const res = db.transaction('Library', 'readonly').objectStore('Library').get(key)
      res.onsuccess = () => resolve(res.result.dir)
      res.onerror = () => reject(res.error)
    } else {
      reject('数据库未打开')
    }
  })
}

export function DBGetAllDir() {
  return new Promise<{ name: string; dir: FileSystemDirectoryHandle}[]>((resolve, reject) => {
    if (db) {
      const res = db.transaction('Library', 'readonly').objectStore('Library').getAll()
      res.onsuccess = () => resolve(res.result)
      res.onerror = () => reject(res.error)
    } else {
      reject('数据库未打开')
    }
  })
}

export function DBClose() {
  if (db) {
    db.close()
    db = null
  }
}
