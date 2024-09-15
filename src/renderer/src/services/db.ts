import Dexie from 'dexie'
import { getVer, addVer } from '@renderer/utils/storage'
class KDBManager {
  name: string = 'KrooseDB'
  db!: Dexie

  async init() {
    this.db = new Dexie(this.name)
    this.db.on('blocked', () => false)
    if (!(await Dexie.exists(this.name))) {
      this.db.version(getVer(this.name)).stores({
        library: '++id,&name,&path,mode',
        curlist: '&id,name,path',
        playlist: '++id,&name'
      })
    }
    // 非首次打开时为动态模式，此时不需要明确的schema
    await this.db.open()
  }

  // 修改数据库schema后打开为普通模式，此时需要明确的schema
  changeSchema(newSchema: { [key: string]: string | null }) {
    const curSchema = this.db.tables.reduce((res, { name, schema }) => {
      res[name] = [ schema.primKey.src, ...schema.indexes.map(i => i.src) ].join(',')
      return res
    }, {} as { [key: string]: string })
    this.db.close()
    this.db.version(getVer(this.name)).stores(curSchema)
    this.db.version(addVer(this.name)).stores(newSchema)
    return this.db.open()
  }
  // Library
  async addLibrary(name: string, path: string, mode: LibMode = 'normal') {
    const id = await this.db.table('library').add({ name, path, mode })
    if (mode === 'normal') await this.changeSchema({ [name]: '++id,name,&path,artist' })
    else if (mode === 'asmr') await this.changeSchema({ [name]: '++id,name,&path' })
    return id as number
  }
  async deleteLibrary(id: number) {
    const lib = await this.db.table('library').get(id)
    if (!lib) return
    this.db.table('library').delete(id)
    await this.changeSchema({ [lib.name]: null })
  }
  updateLibrary(id: number, mode: LibMode) {
    return this.db.table('library').update(id, { mode })
  }
  getLibrary(id: number): Promise<ILibrary | undefined>
  getLibrary(name: string): Promise<ILibrary | undefined>
  getLibrary(value: number | string) {
    if (typeof value === 'number') { return this.db.table('library').get(value) }
    else { return this.db.table('library').get({ name: value }) }
  }
  getLibraries() {
    return this.db.table('library').toArray()
  }
  // Item
  addItem(libName: string, item: ILibItem) {
    return this.db.table(libName).add(item) as Promise<number>
  }
  addItems(libName: string, items: ILibItem[]) {
    return this.db.table(libName).bulkAdd(items) as Promise<readonly number[]>
  }
  getItemNums(libName: string) {
    return this.db.table(libName).count()
  }
  getItems(libName: string, offest?: number, limit?: number) {
    if (offest !== undefined && limit !== undefined) {
      return this.db.table(libName).orderBy('name').offset(offest).limit(limit).toArray()
    } else {
      return this.db.table(libName).orderBy('name').toArray()
    }
  }
  clearItems(libName: string) {
    return this.db.table(libName).clear()
  }
}
const db = new KDBManager()
await db.init()
export default db
