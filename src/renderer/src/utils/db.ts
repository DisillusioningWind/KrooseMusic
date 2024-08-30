import Dexie from 'dexie'

class DBManager {
  name: string = 'KrooseDB'
  db!: Dexie

  async init() {
    this.db = new Dexie(this.name)
    this.db.on('blocked', () => false)
    if (!(await Dexie.exists(this.name))) {
      this.db.version(this.getVer()).stores({
        library: '++id,&name,&path,mode'
      })
    }
    // 非首次打开时为动态模式，此时不需要明确的schema
    await this.db.open()
  }

  getVer() {
    let ver = localStorage.getItem(this.name)
    if (!ver) {
      ver = '1'
      localStorage.setItem(this.name, ver)
    }
    return parseInt(ver)
  }
  addVer() {
    const ver = this.getVer() + 1
    localStorage.setItem(this.name, ver.toString())
    return ver
  }

  // 修改数据库schema后打开为普通模式，此时需要明确的schema
  changeSchema(newSchema: { [key: string]: string | null }) {
    const curSchema = this.db.tables.reduce((res, { name, schema }) => {
      res[name] = [ schema.primKey.src, ...schema.indexes.map(i => i.src) ].join(',')
      return res
    }, {} as { [key: string]: string })
    this.db.close()
    this.db.version(this.getVer()).stores(curSchema)
    this.db.version(this.addVer()).stores(newSchema)
    return this.db.open()
  }

  async addLibrary(name: string, path: string, mode: LibMode = 'normal') {
    const id = await this.db.table('library').add({ name, path, mode })
    await this.changeSchema({ [name]: '++id,name,&path,artist' })
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

  addMusic(libName: string, music: ILibMusic) {
    return this.db.table(libName).add(music) as Promise<number>
  }
  getMusicNums(libName: string) {
    return this.db.table(libName).count()
  }
  getMusics(libName: string, offest?: number, limit?: number) {
    if (offest && limit) {
      return this.db.table(libName).orderBy('name').offset(offest).limit(limit).toArray()
    } else {
      return this.db.table(libName).orderBy('name').toArray()
    }
  }
}
const db = new DBManager()
await db.init()
export default db
