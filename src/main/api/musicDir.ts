// Description: 音乐目录相关操作
import { parseFile } from 'music-metadata'
import { join, basename, extname } from 'path'
import fs from 'fs'

const mscExts = ['.mp3', '.flac', '.wav']
const picExts = ['.jpg', '.jpeg', '.png']
let dirMode: LibMode = 'normal'
let dirItems: fs.Dirent[] = []

/**
 * 获取目录中目标文件数量
 * @param mode 目录模式
 * @param path 目录路径
 * @returns 目标文件数量，包括音乐文件或子目录
 */
export async function getDirLength(mode: LibMode, path: string): Promise<number> {
  dirMode = mode
  if (mode === 'normal') {
    const items = fs.readdirSync(path, { withFileTypes: true, recursive: true })
    dirItems = items.filter(item => item.isFile() && mscExts.includes(extname(item.name).toLowerCase()))
  } else {
    const items = fs.readdirSync(path, { withFileTypes: true })
    dirItems = items.filter(item => item.isDirectory())
  }
  return dirItems.length
}
/**
 * 获取目录中指定索引的文件信息，不应当由渲染进程调用
 * @param index 文件索引
 * @returns 文件信息，包括音乐或子目录
 */
export async function getDirItemData(index: number): Promise<ILibMusic | ILibAlbum | null> {
  if (index < 0 || index >= dirItems.length) return null
  const item = dirItems[index]
  const path = join(item.parentPath, item.name)
  if (dirMode === 'normal') {
    const data = await parseFile(path)
    return {
      name: data.common.title || basename(item.name, extname(item.name)),
      path: path,
      ext: extname(item.name),
      artist: data.common.artist || '未知艺术家',
      duration: data.format.duration || 0
    }
  } else {
    const subs = fs.readdirSync(path, { withFileTypes: true, recursive: true })
    const pic = subs.find(file => file.isFile() && picExts.includes(extname(file.name).toLowerCase()))
    return {
      name: item.name,
      path: path,
      pic: pic ? join(pic.parentPath, pic.name) : ''
    }
  }
}
/**
 * 获取当前目录结构
 * @param path 目录路径
 * @returns 目录结构，包含目录名称、子目录列表和音乐列表
 */
export async function getDirStruc(path: string): Promise<IDir | undefined> { return recurseDir(path) }

/**
 * 内部递归获取目录结构
 * @param path 目录路径
 * @returns 目录结构，包含目录名称、子目录列表和音乐列表
 */
function recurseDir(path: string) {
  const curdir = { name: basename(path), dirs: [], mscs: [] } as IDir
  const items = fs.readdirSync(path, { withFileTypes: true })
  items.forEach(item => {
    if (item.isDirectory()) {
      const subdir = recurseDir(join(item.parentPath, item.name))
      if (!subdir) return
      curdir.dirs.push(subdir)
    } else if (item.isFile() && mscExts.includes(extname(item.name).toLowerCase())) {
      curdir.mscs.push({ name: item.name, path: join(item.parentPath, item.name) })
    }
  })
  return curdir.dirs.length || curdir.mscs.length ? curdir : undefined
}
