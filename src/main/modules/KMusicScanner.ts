import { shell } from 'electron'
import { parseFile } from 'music-metadata'
import { basename, extname, join } from 'path'
import { readdirSync } from 'fs'
import { readdir } from 'fs/promises'
import { KModule } from './KModule.js'

const MSC_EXTS = ['.mp3', '.flac', '.wav']
const PIC_EXTS = ['.jpg', '.jpeg', '.png', '.webp']

export class KMusicScanner extends KModule {
  readonly namespace = 'scan' as const

  provideAPI() {
    return {
      getDirStruc: this.getDirStruc,
      showItemInFolder: shell.showItemInFolder
    }
  }

  /**
   * 获取目录中所有目标文件
   * @param path 目录路径
   * @param mode 目录模式
   * @returns 目标文件数组
   */
  async getDirItems(path: string, mode: LibMode) {
    if (mode === 'normal') {
      return this.getDirMusics(path)
    } else if (mode === 'asmr') {
      return this.getDirAlbums(path)
    } else {
      throw new Error('mode not define')
    }
  }

  async getDirMusics(path: string): Promise<ILibMusic[]> {
    const dirEntrys = await readdir(path, { withFileTypes: true, recursive: true })
    const dirMusics = dirEntrys.filter(entry => entry.isFile() && isMusic(entry.name))
    const libMusics = await Promise.all(dirMusics.map(async music => {
      const mscPath = join(music.parentPath, music.name)
      const mscExtn = extname(music.name)
      const mscData = await parseFile(mscPath)
      const mscItem = {
        name: mscData.common.title || basename(music.name, mscExtn),
        path: mscPath,
        ext: mscExtn,
        artist: mscData.common.artist || '未知艺术家',
        duration: mscData.format.duration || 0
      } as ILibMusic
      return mscItem
    }))
    return libMusics
  }

  async getDirAlbums(path: string): Promise<ILibAlbum[]> {
    const dirEntrys = await readdir(path, { withFileTypes: true, recursive: false })
    const dirAlbums = dirEntrys.filter(entry => entry.isDirectory())
    const libAlbums = await Promise.all(dirAlbums.map(async album => {
      const albPath = join(album.parentPath, album.name)
      const albEnts = await readdir(albPath, { withFileTypes: true, recursive: true })
      const albPict = albEnts.find(albEnt => albEnt.isFile() && isPicture(albEnt.name))
      const albItem = {
        name: album.name,
        path: albPath,
        pic: albPict ? join(albPict.parentPath, albPict.name) : ''
      } as ILibAlbum
      return albItem
    }))
    return libAlbums
  }

  /**
   * 获取当前目录结构
   * @param path 目录路径
   * @returns 目录结构，包含目录名称、子目录列表和音乐列表
   */
  async getDirStruc(path: string): Promise<IDir | undefined> { return this.recurseDir(path) }

  /**
   * 内部递归获取目录结构
   * @param path 目录路径
   * @returns 目录结构，包含目录名称、子目录列表和音乐列表
   */
  private recurseDir(path: string) {
    const curdir = { name: basename(path), dirs: [], mscs: [] } as IDir
    const items = readdirSync(path, { withFileTypes: true })
    items.forEach(item => {
      if (item.isDirectory()) {
        const subdir = this.recurseDir(join(item.parentPath, item.name))
        if (!subdir) return
        curdir.dirs.push(subdir)
      } else if (item.isFile() && isMusic(item.name)) {
        curdir.mscs.push({ name: item.name, path: join(item.parentPath, item.name) })
      }
    })
    return curdir.dirs.length || curdir.mscs.length ? curdir : undefined
  }
}

/** 判断是否为音乐文件 */
function isMusic(name: string) { return MSC_EXTS.includes(extname(name).toLowerCase()) }
/** 判断是否为图片文件 */
function isPicture(name: string) { return PIC_EXTS.includes(extname(name).toLowerCase()) }