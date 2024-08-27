import { IDBPDatabase, openDB } from 'idb'

class DBManager {
  dbName: string = 'KrooseDB'
  //@ts-ignore
  db: IDBPDatabase
  verName: string = 'KrooseVer'
  //@ts-ignore
  verDB: IDBPDatabase
  ver: number = 1

  async init() {
    this.verDB = await openDB(this.verName, 1, {
      upgrade(db) {
        const store = db.createObjectStore('version', { autoIncrement: true })
        store.add({ ver: 1 })
      }
    })
    const { ver } = (await this.verDB.get('version', 1)) || { ver: 1 }
    this.ver = ver
    this.db = await openDB(this.dbName, this.ver, {
      upgrade(db) {
        if (ver === 1) {
          const store = db.createObjectStore('library', { autoIncrement: true })
          store.createIndex('name', 'name', { unique: true })
        }
      }
    })
  }

  async addLibrary(name: string, path: string, mode: LibMode = 'normal') {
    const id = await this.db.add('library', { name, path, mode }) as number
    this.ver++
    this.verDB.put('version', { ver: this.ver }, 1)
    this.db.close()
    this.db = await openDB(this.dbName, this.ver, {
      upgrade(db) {
        const store = db.createObjectStore(name, { autoIncrement: true })
        store.createIndex('name', 'name')
        store.createIndex('path', 'path', { unique: true })
        store.createIndex('artist', 'artist')
      }
    })
    return id
  }
  deleteLibrary(id: number) {
    return this.db.delete('library', id)
  }
  async updateLibrary(id: number, mode: LibMode) {
    let item = await this.db.get('library', id) as ILibrary
    item.mode = mode
    return this.db.put('library', item, id)
  }
  getLibrary(id: number): Promise<ILibrary | undefined>
  getLibrary(name: string): Promise<ILibrary | undefined>
  getLibrary(value: number | string) {
    if (typeof value === 'number') { return this.db.get('library', value) }
    else { return this.db.getFromIndex('library', 'name', value) }
  }
  getLibraries() {
    return this.db.getAll('library')
  }

  addMusic(libName: string, music: ILibMusic) {
    return this.db.add(libName, music)
  }
  getMusics(libName: string) {
    return this.db.getAll(libName)
  }
}
const db = new DBManager()
await db.init()
export default db
