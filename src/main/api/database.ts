// Description: 数据库操作
import Database from 'better-sqlite3'
import { app } from 'electron/main'
import { join } from 'path'
import { getDirItemData } from './musicDir.js'
// 数据库路径
const dbPath = process.env.NODE_ENV === 'development' ? join(__dirname, '../../data/userData/KrooseDB.db') : join(app.getPath('userData'), 'KrooseDB.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
// 准备语句
const createTableLibrary = () => db.prepare(`
  CREATE TABLE IF NOT EXISTS library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL UNIQUE,
    mode TEXT NOT NULL
  )
`)
const createTableCurList = () => db.prepare(`
  CREATE TABLE IF NOT EXISTS curlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE
  )
`)
const createTableNormalLib = (name: string) => db.prepare(`
  CREATE TABLE IF NOT EXISTS ${name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    ext TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration INTEGER NOT NULL
  )
`)
const createTableAsmrLib = (name: string) => db.prepare(`
  CREATE TABLE IF NOT EXISTS ${name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    pic TEXT
  )
`)
/** 获取所有曲库表项 */
const getAllTableLibrary = () => db.prepare<[], ILibrary>('SELECT * FROM library')
/** 添加曲库表项 */
const insertTableLibrary = () => db.prepare<{ name: string, path: string, mode: LibMode }>('INSERT INTO library (name, path, mode) VALUES (@name, @path, @mode)')
/** 删除曲库表项 */
const deleteTableLibrary = () => db.prepare<{ name: string }>('DELETE FROM library WHERE name = @name')
/** 删除当前表 */
const dropTableLib = (name: string) => db.prepare(`DROP TABLE IF EXISTS ${name}`)
/** 获取所有当前表项 */
const getAllTableLib = (name: string) => db.prepare<[], ILibItem>(`SELECT * FROM ${name}`)
/** 插入普通曲库表项 */
const insertTableNormalLib = (libName: string) => db.prepare<ILibMusic>(`INSERT INTO ${libName} (name, path, ext, artist, duration) VALUES (@name, @path, @ext, @artist, @duration)`)
/** 插入专辑曲库表项 */
const insertTableAsmrLib = (libName: string) => db.prepare<ILibAlbum>(`INSERT INTO ${libName} (name, path, pic) VALUES (@name, @path, @pic)`)
/** 删除曲库表项 */
const deleteTableLib = (libName: string) => db.prepare<{ path: string }>(`DELETE FROM ${libName} WHERE path = @path`)
// 事务
/** 创建曲库表和存储当前列表的表 */
const transInitDB = db.transaction(() => {
  createTableLibrary().run()
  createTableCurList().run()
})
/** 添加曲库表项和对应的表 */
const transAddLib = db.transaction((name: string, path: string, mode: LibMode) => {
  const { lastInsertRowid } = insertTableLibrary().run({ name, path, mode })
  if (mode === 'normal') { createTableNormalLib(name).run() }
  else if (mode === 'asmr') { createTableAsmrLib(name).run() }
  return Number(lastInsertRowid)
})
/** 删除曲库表项和对应的表 */
const transDelLib = db.transaction((name: string) => {
  deleteTableLibrary().run({ name })
  dropTableLib(name).run()
})
// 初始化数据库
transInitDB()
/** 获取所有曲库 */
export async function getLibraries() { return getAllTableLibrary().all() }
/** 添加新曲库 @param name 曲库名 @param path 曲库路径 @param mode 曲库模式，默认为normal */
export async function addLibrary(name: string, path: string, mode: LibMode = 'normal') { return transAddLib(name, path, mode) }
/** 删除曲库 @param name 曲库名 */
export async function deleteLibrary(name: string) { return transDelLib(name) }
/** 获取曲库所有项目 @param name 曲库名 */
export async function getItems(name: string) { return getAllTableLib(name).all() }
/** 添加项目，调用前请先调用一遍 getDirLength，项目数据和索引由该函数提供 @param libName 曲库名 @param libMode 曲库模式 @param dirIdx 目录索引，不超过目录中目标文件数量 */
export async function addItem(libName: string, libMode: LibMode, dirIdx: number) {
  const item = await getDirItemData(dirIdx)
  if (!item) { console.error('File data not found'); return }
  if (libMode === 'normal') { insertTableNormalLib(libName).run(item as ILibMusic) }
  else if (libMode === 'asmr') { insertTableAsmrLib(libName).run(item as ILibAlbum) }
}
/** 删除项目 @param libName 曲库名 @param path 项目路径 */
export async function deleteItem(libName: string, path: string) { deleteTableLib(libName).run({ path }) }
