import Dexie, { type EntityTable } from 'dexie'

class DBManager {
  name: string = 'KrooseDB'
  db: Dexie & { library: EntityTable<ILibrary, 'id'> }

  constructor() {
    this.db = new Dexie(this.name) as Dexie & { library: EntityTable<ILibrary, 'id'> }
    this.db.version(1).stores({
      library: '++id, &name, &path, mode'
    })
  }

  addLibrary(name: string, path: string, mode: LibMode = 'normal') {
    return this.db.library.add({ name, path, mode })
  }
  deleteLibrary(id: number) {
    return this.db.library.delete(id)
  }
  updateLibrary(id: number, mode: LibMode) {
    return this.db.library.update(id, { mode })
  }

  getLibrary(id: number): Promise<ILibrary | undefined>
  getLibrary(name: string): Promise<ILibrary | undefined>
  getLibrary(value: number | string) {
    if (typeof value === 'number') { return this.db.library.get(value) }
    else { return this.db.library.get({ name: value }) }
  }
  getLibraries() {
    return this.db.library.toArray()
  }

}
const db = new DBManager()
export default db
