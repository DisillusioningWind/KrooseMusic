import sqlite3 from 'sqlite3'
import { dirname, join } from 'path'
import { app } from 'electron'

class KrooseDB {
  dbName: string
  dbPath: string
  db: sqlite3.Database
  constructor() {
    this.dbName = 'Kroose.db'
    this.dbPath = process.env.NODE_ENV === 'development' ? (join(app.getAppPath(), 'Data', 'userData', this.dbName)) : (join(dirname(app.getPath('exe')), 'Data', 'userData', this.dbName))
    this.db = new sqlite3.Database(this.dbPath, (err) => err ? console.error('Failed to connect database:', err) : console.log('Database connected'))
  }

  createTableDirList() {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS DirList (
        name TEXT NOT NULL UNIQUE PRIMARY KEY,
        path TEXT NOT NULL UNIQUE,
        mode TEXT NOT NULL DEFAULT 'normal' CHECK(mode IN ('normal', 'asmr'))
      )`, (e) => e ? console.error('Failed to create table DirList:', e) : console.log('Table DirList created'))
    })
  }

  createTableDir(name: string, path: string, mode: string) {

  }

  insertDirList(name: string, path: string, mode: string) {
    this.db.run(`INSERT INTO DirList VALUES (${name}, ${path}, ${mode})`, (e) => e ? console.error('Failed to insert into DirList:', e) : console.log('DirList inserted:', name))
  }
  deleteDirList(name: string) {
    this.db.run(`DELETE FROM DirList WHERE name = ${name}`, (e) => e ? console.error('Failed to delete from DirList:', e) : console.log('DirList deleted:', name))
  }
  updateDirList(name: string, mode: string) {
    this.db.run(`UPDATE DirList SET mode = ${mode} WHERE name = ${name}`, (e) => e ? console.error('Failed to update DirList:', e) : console.log('DirList updated:', name))
  }

}
const db = new KrooseDB()
export default db
