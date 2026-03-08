import { parseFile } from 'music-metadata'
import { basename, extname, join } from 'path'
import { KModule } from './KModule.js'
import { Dirent, readdirSync } from 'fs'

const MSC_EXTS = ['.mp3', '.flac', '.wav']
const PIC_EXTS = ['.jpg', '.jpeg', '.png', '.webp']

export class KMusicScanner extends KModule {
  readonly namespace = 'scan' as const
  private mode: LibMode = 'normal'
  private items: Dirent[] = []

  provideAPI() {
    return {
      getDirLength: this.getDirLength,
      getDirStruc: this.getDirStruc
    }
  }

  /**
   * 获取目录中目标文件数量
   * @param mode 目录模式
   * @param path 目录路径
   * @returns 目标文件数量，包括音乐文件或子目录
   */
  async getDirLength(mode: LibMode, path: string): Promise<number> {
    this.mode = mode
    const items = readdirSync(path, { withFileTypes: true, recursive: mode === 'normal' ? true : false })
    this.items = mode === 'normal' ? items.filter(item => item.isFile() && isMusic(item.name)) : items.filter(item => item.isDirectory())
    return this.items.length
  }

  /**
   * 获取目录中指定索引的文件信息
   * @warning 不应当由渲染进程调用
   * @param index 文件索引
   * @returns 文件信息，类型为音乐或专辑
   */
  async getDirItemData(index: number): Promise<ILibMusic | ILibAlbum | undefined> {
    if (index < 0 || index >= this.items.length) return undefined
    const item = this.items[index]
    const path = join(item.parentPath, item.name)
    if (this.mode === 'normal') {
      const data = await parseFile(path)
      return {
        name: data.common.title || basename(item.name, extname(item.name)),
        path: path,
        ext: extname(item.name),
        artist: data.common.artist || '未知艺术家',
        duration: data.format.duration || 0
      }
    } else if (this.mode === 'asmr') {
      const subs = readdirSync(path, { withFileTypes: true, recursive: true })
      const pic = subs.find(file => file.isFile() && isPicture(file.name))
      return {
        name: item.name,
        path: path,
        pic: pic ? join(pic.parentPath, pic.name) : ''
      }
    } else return undefined
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