import Database from 'better-sqlite3'
import { app } from 'electron/main'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { KModule } from './KModule.js'
import { KMusicScanner } from './KMusicScanner.js'

/** 数据库模块 */
export class KMusicDatabase extends KModule {
  readonly namespace = 'db' as const
  private db: Database.Database
  private dbPath: string

  constructor() {
    super()
    this.dbPath = process.env.NODE_ENV === 'development' ? join(__dirname, '../../data/userData/KrooseDB.db') : join(app.getPath('userData'), 'KrooseDB.db')

    const dbDir = dirname(this.dbPath)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    this.db = new Database(this.dbPath)
    this.db.pragma('journal_mode = WAL')
    this.transCreateLibrary()
  }

  // ========== 接口 ==========

  provideAPI() {
    return {
      getLibraries: this.getAllTableLibrary,
      addLibrary: this.transCreateCommonLib,
      delLibrary: this.transDeleteCommonLib,
      getLibItems: this.getAllTableCommonLib,
      addLibItem: this.insertTableCommonLib,
      delLibItem: this.deleteTableCommonLib,
      searchLibItems: this.searchTableCommonLib,
    }
  }

  // ========== 创建 ==========

  private createTableLibrary() {
    return this.db.prepare(
      `CREATE TABLE IF NOT EXISTS library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        mode TEXT NOT NULL
      )`
    ).run()
  }

  private createTableCurList() {
    return this.db.prepare(
      `CREATE TABLE IF NOT EXISTS curlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE
      )`
    ).run()
  }

  private createTableNormalLib(libID: number) {
    return this.db.prepare(
      `CREATE TABLE IF NOT EXISTS "${libID}" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        ext TEXT NOT NULL,
        artist TEXT NOT NULL,
        duration INTEGER NOT NULL
      )`
    ).run()
  }

  private createTableAlbumLib(libID: number) {
    return this.db.prepare(
      `CREATE TABLE IF NOT EXISTS "${libID}" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        pic TEXT
      )`
    ).run()
  }

  private createTableCommonLib(libID: number, libMode: LibMode) {
    if (libMode === 'normal') {
      this.createTableNormalLib(libID)
    } else if (libMode === 'asmr') {
      this.createTableAlbumLib(libID)
    } else {
      throw new Error('mode not define')
    }
  }

  // ========== 增加 ==========

  private insertTableLibrary(name: string, path: string, mode: LibMode) {
    return this.db.prepare<{ name: string, path: string, mode: LibMode }>('INSERT INTO library (name, path, mode) VALUES (@name, @path, @mode)').run({ name, path, mode })
  }

  private insertTableNormalLib(libID: number, item: ILibMusic) {
    return this.db.prepare<ILibMusic>(`INSERT INTO "${libID}" (name, path, ext, artist, duration) VALUES (@name, @path, @ext, @artist, @duration)`).run(item)
  }

  private insertTableAlbumLib(libID: number, item: ILibAlbum) {
    return this.db.prepare<ILibAlbum>(`INSERT INTO "${libID}" (name, path, pic) VALUES (@name, @path, @pic)`).run(item)
  }

  private async insertTableCommonLib(libID: number, libMode: LibMode, item: ILibItem) {
    if (libMode === 'normal') {
      this.insertTableNormalLib(libID, item as ILibMusic)
    } else if (libMode === 'asmr') {
      this.insertTableAlbumLib(libID, item as ILibAlbum)
    } else {
      throw new Error('mode not define')
    }
  }

  // ========== 删除 ==========

  private deleteTableLibrary(libID: number) {
    return this.db.prepare<{ libID: number }>('DELETE FROM library WHERE id = @libID').run({ libID })
  }

  private deleteTableCommonLib(libID: number, itemID: number) {
    return this.db.prepare<{ itemID: number }>(`DELETE FROM "${libID}" WHERE id = @libID`).run({ itemID })
  }

  private dropTableCommonLib(libID: number) {
    return this.db.prepare(`DROP TABLE IF EXISTS "${libID}"`).run()
  }

  // ========== 查询 ==========

  private async getAllTableLibrary() {
    return this.db.prepare<[], ILibrary>('SELECT * FROM library').all()
  }

  private getAllTableCommonLib(libID: number) {
    return this.db.prepare<[], ILibItem>(`SELECT * FROM "${libID}"`).all()
  }

  private searchTableCommonLib(libID: number, keyword: string) {
    const likeword = `%${keyword}%`
    return this.db.prepare<{ keyword: string }, ILibItem>(`SELECT * FROM "${libID}" WHERE name LIKE @keyword`).all({ keyword: likeword })
  }

  // ========== 事务 ==========

  /** 创建总库表和当前播放列表 */
  private transCreateLibrary() {
    return this.db.transaction(() => {
      this.createTableLibrary()
      this.createTableCurList()
    })()
  }

  /** 添加总库表项和对应的表 */
  private async transCreateCommonLib(name: string, path: string, mode: LibMode) {
    // 插入总库表
    const libRes = this.insertTableLibrary(name, path, mode)
    const libID = Number(libRes.lastInsertRowid)
    // 创建曲库表
    this.createTableCommonLib(libID, mode)
    // 插入曲库表
    const libItems = await this.getMod(KMusicScanner).getDirItems(path, mode)
    for (const libItem of libItems) {
      await this.insertTableCommonLib(libID, mode, libItem)
    }
    return libID
  }

  /** 删除总库表项和对应的表 */
  private transDeleteCommonLib(libID: number) {
    return this.db.transaction((libID: number) => {
      this.deleteTableLibrary(libID)
      this.dropTableCommonLib(libID)
    })(libID)
  }
}